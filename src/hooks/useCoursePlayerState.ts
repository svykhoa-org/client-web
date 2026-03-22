import { useCallback, useEffect, useState } from 'react';

import type { CourseVM } from '@/models/CourseViewModel';

export interface CoursePlayerState {
  courseId: string;
  currentModuleId: string | null;
  currentLessonId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface CoursePlayerActions {
  selectLesson: (lessonId: string) => void;
  selectModule: (moduleId: string) => void;
  goToNextLesson: () => void;
  goToPreviousLesson: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useCoursePlayerState(
  courseVM: CourseVM | null,
  initialLessonId?: string
): [CoursePlayerState, CoursePlayerActions] {
  const [state, setState] = useState<CoursePlayerState>({
    courseId: courseVM?.id || '',
    currentModuleId: null,
    currentLessonId: null,
    isLoading: true,
    error: null,
  });

  // Initialize first lesson
  useEffect(() => {
    if (!courseVM) return;

    const targetLesson = undefined;

    if (targetLesson) {
      setState(prev => ({
        ...prev,
        courseId: courseVM.id,
        currentModuleId: null,
        currentLessonId: null,
        isLoading: false,
      }));
    }
  }, [courseVM, initialLessonId]);

  const selectLesson = useCallback(
    (lessonId: string) => {
      if (!courseVM) return;

      const lesson = undefined;

      if (lesson) {
        setState(prev => ({
          ...prev,
          currentModuleId: null,
          currentLessonId: lessonId,
          error: null,
        }));
      }
    },
    [courseVM]
  );

  const selectModule = useCallback(
    (moduleId: string) => {
      if (!courseVM) return;

      const module = courseVM.modules.find(m => m.id === moduleId);
      if (module && module.lessons.length > 0) {
        const firstLesson = module.lessons[0];
        setState(prev => ({
          ...prev,
          currentModuleId: moduleId,
          currentLessonId: firstLesson.id,
          error: null,
        }));
      }
    },
    [courseVM]
  );

  const goToNextLesson = useCallback(() => {
    if (!courseVM || !state.currentLessonId) return;
  }, [courseVM, state.currentLessonId]);

  const goToPreviousLesson = useCallback(() => {
    if (!courseVM || !state.currentLessonId) return;
  }, [courseVM, state.currentLessonId]);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const actions: CoursePlayerActions = {
    selectLesson,
    selectModule,
    goToNextLesson,
    goToPreviousLesson,
    setError,
    setLoading,
  };

  return [state, actions];
}
