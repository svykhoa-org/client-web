import { Col, List, Row, Typography } from 'antd';

import { useListCourse } from '@/lib/tanstack-query';

import { CourseItem } from './components/CourseItem';

const { Title } = Typography;

export const ListCoursePage = () => {
  const { data, isLoading } = useListCourse({ page: 1, pageSize: 10 });
  const { courses = [] } = data || {};

  return (
    <div className="w-full bg-gray-100 p-2 sm:p-4">
      <Row gutter={[8, 16]} className="w-full">
        <Col xs={24} lg={18}>
          <div className="p-2">
            <Title level={3} className="mb-4 text-center text-lg text-blue-500 sm:text-xl">
              Các khoá học y khoa liên tục
            </Title>
            <Row gutter={[8, 12]} className="w-full">
              {courses.map(course => (
                <Col xs={24} sm={12} lg={8} key={course._id}>
                  <CourseItem course={course} />
                </Col>
              ))}
            </Row>
          </div>
          {/*  */}
        </Col>

        <Col xs={24} lg={6}>
          <div className="p-2">
            <Title level={4} className="mb-4 text-center text-base text-blue-500 sm:text-lg">
              Khoá học sắp khai giảng
            </Title>
            <List
              dataSource={courses}
              loading={isLoading}
              split
              renderItem={item => (
                <div key={item._id} className="mb-2 rounded-md border p-2">
                  <h4 className="mb-1 line-clamp-2 text-xs font-semibold">{item.title}</h4>
                  <p className="line-clamp-3 text-xs font-medium">{item.description}</p>
                </div>
              )}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
