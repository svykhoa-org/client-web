// import type { FC } from 'react';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';

// import { BookOutlined, ClockCircleOutlined, FireOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
// import { Button, Spin, message } from 'antd';

// import type { Course } from '@/models/Course';
// import { getHotCourses } from '@/services/Course/getHotCourses';

// export const HotCoursesList: FC = () => {
//   const navigate = useNavigate();
//   const [hotCourses, setHotCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHotCourses = async () => {
//       try {
//         const response = await getHotCourses(8);
//         if (response.code === 200) {
//           setHotCourses(response.data);
//         } else {
//           message.error('Không thể tải khóa học hot');
//         }
//       } catch (error) {
//         console.error('Error fetching hot courses:', error);
//         message.error('Không thể tải khóa học hot');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotCourses();
//   }, []);

//   const handleViewCourse = (courseId: string) => {
//     navigate(`/courses/${courseId}`);
//   };

//   const handleViewAll = () => {
//     navigate('/e-learning');
//   };

//   const formatDuration = (seconds: number): string => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     if (hours > 0) {
//       return `${hours}h ${minutes}m`;
//     }
//     return `${minutes}m`;
//   };

//   const getTotalDuration = (modules: Course['modules']): number => {
//     return modules.reduce((total, module) => {
//       return total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0);
//     }, 0);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="mb-5 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FireOutlined className="text-base text-orange-500" />
//           <h3 className="text-base font-semibold text-gray-800">Khóa học nổi bật</h3>
//         </div>
//         <Button type="primary" ghost size="small" className="text-xs" onClick={handleViewAll}>
//           Xem tất cả
//         </Button>
//       </div>

//       {/* Course Cards Container */}
//       <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 flex gap-3 overflow-x-auto pb-2">
//         {hotCourses.map((course, index) => (
//           <div
//             key={course._id}
//             className="group w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md lg:w-72"
//             onClick={() => handleViewCourse(course._id)}
//           >
//             {/* Course Image */}
//             <div className="relative h-32 overflow-hidden sm:h-36">
//               <img
//                 src={course.thumbnailUrl || '/api/placeholder/280/160'}
//                 alt={course.name}
//                 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//               />

//               {/* Hot Badge */}
//               {index < 3 && (
//                 <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 text-white shadow-md">
//                   <FireOutlined className="text-xs" />
//                   <span className="text-xs font-bold">TOP {index + 1}</span>
//                 </div>
//               )}

//               {/* Play Overlay */}
//               <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//                 <PlayCircleOutlined className="text-2xl text-white" />
//               </div>
//             </div>

//             {/* Course Content */}
//             <div className="space-y-2 p-3">
//               {/* Title */}
//               <h4 className="line-clamp-2 min-h-[2.25rem] text-xs leading-tight font-semibold text-gray-800">
//                 {course.name}
//               </h4>

//               {/* Instructor */}
//               <div className="flex items-center gap-1.5">
//                 <UserOutlined className="text-xs text-gray-400" />
//                 <span className="text-xs text-gray-600">{course.instructors?.[0]?.name || 'Giảng viên'}</span>
//               </div>

//               {/* Stats */}
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <span>👥</span>
//                   <span>{course.participantCount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <BookOutlined className="text-xs" />
//                   <span>{course.modules?.length || 0} mô-đun</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <ClockCircleOutlined className="text-xs" />
//                   <span>{formatDuration(getTotalDuration(course.modules))}</span>
//                 </div>
//               </div>

//               {/* Price & Enrollment */}
//               <div className="flex items-center justify-between">
//                 {course.isPaid ? (
//                   <span className="text-sm font-bold text-blue-600">
//                     ${typeof course.price === 'number' ? course.price : course.price.amount}
//                   </span>
//                 ) : (
//                   <span className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 text-xs font-semibold text-white">
//                     Miễn phí
//                   </span>
//                 )}

//                 {!course.progress?.isEnrolled && (
//                   <Button
//                     type="primary"
//                     size="small"
//                     className="text-xs"
//                     onClick={e => {
//                       e.stopPropagation();
//                       handleViewCourse(course._id);
//                     }}
//                   >
//                     Học ngay
//                   </Button>
//                 )}
//               </div>

//               {/* Progress if enrolled */}
//               {course.progress?.isEnrolled && (
//                 <div className="space-y-1">
//                   <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
//                     <div
//                       className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
//                       style={{ width: `${course.progress.completionPercentage}%` }}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-600">{course.progress.completionPercentage}% hoàn thành</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
