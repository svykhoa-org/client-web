// import { useEffect, useMemo } from 'react';
// import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router';

// import { ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
// import { Col, Collapse, Result, Row, Spin } from 'antd';
// import classNames from 'classnames';

// import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer';
// import RouteConfig from '@/constants/RouteConfig';
// import { useDetail } from '@/hooks/useCRUD/useDetail';
// import type { Course } from '@/models/Course';
// // import { getCourseById } from '@/services/Course';

// export const CoursePlayerPage = () => {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const currentModuleIndex = searchParams.get('modules');
//   const currentLessonIndex = searchParams.get('lessons');

//   const {
//     handleGetDetail,
//     data: course,
//     isLoadingDetail,
//   } = useDetail({
//     getDetail: id
//       ? async () => {
//           // const response = await getCourseById(id);
//           // console.log('RegisterPage -> response', response);

//           // if (response.code === 200 && response.data) {
//           //   return response.data;
//           // }
//           return null;
//         }
//       : undefined,
//   });

//   const getUrl = (course: Course | null, moduleIndex: string | null, lessonIndex: string | null) => {
//     if (course) {
//       const mIndex = moduleIndex !== null ? Number(moduleIndex) : undefined;
//       const lIndex = lessonIndex !== null ? Number(lessonIndex) : undefined;
//       if (
//         typeof mIndex === 'number' &&
//         !isNaN(mIndex) &&
//         typeof lIndex === 'number' &&
//         !isNaN(lIndex) &&
//         course.modules &&
//         course.modules[mIndex] &&
//         course.modules[mIndex].lessons &&
//         course.modules[mIndex].lessons[lIndex]
//       ) {
//         return course.modules[mIndex].lessons[lIndex].videoUrl || null;
//       }
//     }
//     return null;
//   };

//   const handleSelectLesson = (moduleIndex: number, lessonIndex: number) => {
//     if (id) {
//       navigate(
//         RouteConfig.CoursePlayerPage.path.replace(':id', id) +
//           '?' +
//           createSearchParams({
//             modules: String(moduleIndex),
//             lessons: String(lessonIndex),
//           }).toString(),
//         {
//           replace: true,
//         }
//       );
//     }
//   };

//   const videoUrl = useMemo(
//     () => getUrl(course, currentModuleIndex, currentLessonIndex),
//     [course, currentModuleIndex, currentLessonIndex]
//   );

//   useEffect(() => {
//     handleGetDetail();
//   }, [id, currentModuleIndex, currentLessonIndex]); // eslint-disable-line react-hooks/exhaustive-deps

//   if (isLoadingDetail) {
//     return (
//       <div className="flex min-h-screen justify-center pt-32">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!videoUrl) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Result status="404" title="404" subTitle="Khóa học không tồn tại" />
//       </div>
//     );
//   }

//   return (
//     <Row className="min-h-screen" gutter={[16, 16]}>
//       <Col span={24} lg={16}>
//         <VideoPlayer url={videoUrl} />
//       </Col>
//       <Col span={24} lg={8} className="h-svh overflow-auto">
//         <div className="h-fit bg-white p-4">
//           <h4 className="py-4 text-center text-xl">Nội dung khóa học</h4>
//           <Collapse
//             activeKey={course?.modules.map((_, index) => index.toString())}
//             items={course?.modules.map((module, moduleIndex) => ({
//               key: moduleIndex.toString(),
//               label: (
//                 <div className="flex w-full items-center justify-between pr-4">
//                   <span className="text-base font-medium">{module.name}</span>
//                   <span className="text-sm text-gray-500">{module.lessons.length} bài học</span>
//                 </div>
//               ),
//               children: (
//                 <div className="space-y-2">
//                   {module.description && <p className="mb-4 text-sm text-gray-600">{module.description}</p>}
//                   {module.lessons.map((lesson, lessonIndex) => {
//                     const isActive =
//                       String(currentModuleIndex) === String(moduleIndex) &&
//                       String(currentLessonIndex) === String(lessonIndex);
//                     return (
//                       <div
//                         key={lessonIndex}
//                         className={classNames(
//                           'flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-gray-100',
//                           {
//                             'border-blue-500 bg-blue-50': isActive,
//                           }
//                         )}
//                         onClick={() => handleSelectLesson(moduleIndex, lessonIndex)}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <PlayCircleOutlined />
//                           <div>
//                             <div className={`font-medium`}>{lesson.name}</div>
//                             {lesson.description && <div className="text-sm text-gray-500">{lesson.description}</div>}
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2 text-sm text-gray-500">
//                           <ClockCircleOutlined />
//                           <span>{Math.floor(lesson.duration / 60)} phút</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ),
//             }))}
//           />
//         </div>
//       </Col>
//     </Row>
//   );
// };
