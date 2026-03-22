import { useCallback, useEffect, useRef, useState } from 'react';

import type { CourseProgress, LessonProgress } from '@/models/CourseViewModel';

const PROGRESS_STORAGE_KEY = 'course_watch_progress';
const SAVE_INTERVAL = 5000; // Save every 5 seconds
const COMPLETION_THRESHOLD = 0.9; // 90% watched = completed

export interface WatchProgressHook {
  progress: LessonProgress | null;
  courseProgress: CourseProgress | null;
  updateProgress: (currentTime: number, duration: number) => void;
  markAsCompleted: () => void;
  isCompleted: boolean;
  watchedPercentage: number;
}

export function useWatchProgress(courseId: string, lessonId: string | null): WatchProgressHook {
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    if (!courseId || !lessonId) return;

    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (stored) {
      try {
        const allProgress: Record<string, CourseProgress> = JSON.parse(stored);
        const currentCourseProgress = allProgress[courseId];

        setCourseProgress(currentCourseProgress || null);

        if (currentCourseProgress?.lessons[lessonId]) {
          setProgress(currentCourseProgress.lessons[lessonId]);
        } else {
          // Initialize new lesson progress
          const newProgress: LessonProgress = {
            lessonId,
            watchedDuration: 0,
            totalDuration: 0,
            isCompleted: false,
            lastWatchedAt: new Date(),
          };
          setProgress(newProgress);
        }
      } catch (error) {
        console.error('Failed to load watch progress:', error);
      }
    } else {
      // Initialize new progress
      const newProgress: LessonProgress = {
        lessonId,
        watchedDuration: 0,
        totalDuration: 0,
        isCompleted: false,
        lastWatchedAt: new Date(),
      };
      setProgress(newProgress);
    }
  }, [courseId, lessonId]);

  // Save progress to localStorage (debounced)
  const saveProgress = useCallback(
    (updatedProgress: LessonProgress) => {
      if (!courseId || !lessonId) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        try {
          const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
          const allProgress: Record<string, CourseProgress> = stored ? JSON.parse(stored) : {};

          // Update course progress
          const currentCourseProgress = allProgress[courseId] || {
            courseId,
            lessons: {},
            overallProgress: 0,
          };

          currentCourseProgress.lessons[lessonId] = updatedProgress;

          // Calculate overall progress
          const lessonsArray = Object.values(currentCourseProgress.lessons);
          const completedLessons = lessonsArray.filter(l => l.isCompleted).length;
          currentCourseProgress.overallProgress =
            lessonsArray.length > 0 ? (completedLessons / lessonsArray.length) * 100 : 0;

          allProgress[courseId] = currentCourseProgress;
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));

          setCourseProgress(currentCourseProgress);
        } catch (error) {
          console.error('Failed to save watch progress:', error);
        }
      }, SAVE_INTERVAL);
    },
    [courseId, lessonId]
  );

  const updateProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!lessonId || duration <= 0) return;

      setProgress(prev => {
        if (!prev) return null;

        const watchedDuration = Math.max(currentTime, prev.watchedDuration);
        const watchedPercentage = watchedDuration / duration;
        const isCompleted = prev.isCompleted || watchedPercentage >= COMPLETION_THRESHOLD;

        const updatedProgress: LessonProgress = {
          ...prev,
          watchedDuration,
          totalDuration: duration,
          isCompleted,
          lastWatchedAt: new Date(),
        };

        saveProgress(updatedProgress);
        return updatedProgress;
      });
    },
    [lessonId, saveProgress]
  );

  const markAsCompleted = useCallback(() => {
    if (!lessonId) return;

    setProgress(prev => {
      if (!prev) return null;

      const updatedProgress: LessonProgress = {
        ...prev,
        isCompleted: true,
        watchedDuration: prev.totalDuration,
        lastWatchedAt: new Date(),
      };

      saveProgress(updatedProgress);
      return updatedProgress;
    });
  }, [lessonId, saveProgress]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const isCompleted = progress?.isCompleted || false;
  const watchedPercentage =
    progress && progress.totalDuration > 0 ? (progress.watchedDuration / progress.totalDuration) * 100 : 0;

  return {
    progress,
    courseProgress,
    updateProgress,
    markAsCompleted,
    isCompleted,
    watchedPercentage,
  };
}
