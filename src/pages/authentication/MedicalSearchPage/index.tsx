import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
  BookOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, Row, Spin, Tabs, Tag, Typography } from 'antd';

import { EnhancedSearchBar } from '@/components/common/Header';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Interfaces
interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  specialty: string;
  confidence: number;
  symptoms: string[];
}

interface SearchResultTab {
  guidelines: GuidelineResult[];
  references: ReferenceResult[];
  courses: CourseResult[];
}

interface GuidelineResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  relevance: number;
}

interface ReferenceResult {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  keywords: string[];
}

interface CourseResult {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  cmePoints: number;
  level: string;
}

const MedicalSearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultTab>({
    guidelines: [],
    references: [],
    courses: [],
  });

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (_query: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls to LLM backend
      // const medicalAnalysis = await medicalSearchService.analyzeMedicalQuery(query);
      // const searchResults = await medicalSearchService.getSearchResults(query);

      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock medical conditions
      const mockConditions: MedicalCondition[] = [
        {
          id: '1',
          name: 'Căng thẳng đầu',
          description: 'Đau đầu do căng thẳng là loại đau đầu phổ biến nhất, thường do stress và căng cơ.',
          specialty: 'Thần kinh',
          confidence: 85,
          symptoms: ['đau đầu', 'căng cơ cổ', 'mệt mỏi'],
        },
        {
          id: '2',
          name: 'Migraine',
          description: 'Đau nửa đầu là tình trạng đau đầu mãn tính với cơn đau dữ dội một bên.',
          specialty: 'Thần kinh',
          confidence: 70,
          symptoms: ['đau đầu', 'buồn nôn', 'nhạy cảm ánh sáng'],
        },
        {
          id: '3',
          name: 'Viêm xoang',
          description: 'Viêm niêm mạc xoang có thể gây đau đầu và áp lực vùng mặt.',
          specialty: 'Tai Mũi Họng',
          confidence: 60,
          symptoms: ['đau đầu', 'nghẹt mũi', 'áp lực mặt'],
        },
      ];

      // Mock search results
      const mockResults: SearchResultTab = {
        guidelines: [
          {
            id: '1',
            title: 'Hướng dẫn chẩn đoán và điều trị đau đầu nguyên phát',
            summary:
              'Quy trình tiêu chuẩn cho việc chẩn đoán và điều trị các loại đau đầu nguyên phát theo khuyến cáo quốc tế.',
            source: 'Bộ Y tế Việt Nam',
            relevance: 95,
          },
          {
            id: '2',
            title: 'Phác đồ điều trị migraine cấp tính',
            summary: 'Hướng dẫn sử dụng thuốc và liệu pháp không dùng thuốc cho cơn migraine cấp.',
            source: 'Hội Thần kinh Việt Nam',
            relevance: 88,
          },
        ],
        references: [
          {
            id: '1',
            title: 'Epidemiology and burden of headache disorders in Vietnam',
            authors: ['Nguyen V.A.', 'Tran B.C.', 'Le D.E.'],
            journal: 'Journal of Vietnamese Medicine',
            year: 2023,
            abstract: 'Nghiên cứu về tình hình và gánh nặng bệnh tật do đau đầu tại Việt Nam...',
            keywords: ['đau đầu', 'dịch tễ học', 'Việt Nam'],
          },
          {
            id: '2',
            title: 'Effectiveness of acupuncture in treating chronic headache',
            authors: ['Smith J.', 'Johnson M.', 'Brown K.'],
            journal: 'Pain Medicine International',
            year: 2023,
            abstract: 'Đánh giá hiệu quả của châm cứu trong điều trị đau đầu mãn tính...',
            keywords: ['châm cứu', 'đau đầu mãn tính', 'điều trị'],
          },
        ],
        courses: [
          {
            id: '1',
            title: 'Chẩn đoán và điều trị đau đầu trong thực hành lâm sàng',
            description: 'Khóa học CME về cách tiếp cận có hệ thống đối với bệnh nhân đau đầu.',
            instructor: 'TS.BS Nguyễn Văn An',
            duration: '8 giờ',
            cmePoints: 8,
            level: 'Trung cấp',
          },
          {
            id: '2',
            title: 'Migraine: Từ cơ chế bệnh sinh đến điều trị hiện đại',
            description: 'Cập nhật kiến thức mới nhất về migraine và các phương pháp điều trị tiên tiến.',
            instructor: 'PGS.TS Trần Thị Bình',
            duration: '6 giờ',
            cmePoints: 6,
            level: 'Cao cấp',
          },
        ],
      };

      setMedicalConditions(mockConditions);
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const getSpecialtyIcon = (specialty: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Thần kinh': <HeartOutlined className="text-red-500" />,
      'Tim mạch': <HeartOutlined className="text-red-600" />,
      'Tai Mũi Họng': <MedicineBoxOutlined className="text-blue-500" />,
      'Phụ sản': <UserOutlined className="text-pink-500" />,
      'Nhi khoa': <SafetyOutlined className="text-blue-500" />,
    };
    return icons[specialty] || <MedicineBoxOutlined className="text-gray-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'blue';
    if (confidence >= 60) return 'orange';
    return 'red';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search */}
      <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <EnhancedSearchBar
              onSearch={handleNewSearch}
              placeholder="💊 Tìm kiếm triệu chứng, bệnh lý, thuốc..."
              size="large"
              className="search-results-header w-full"
            />
          </div>
        </div>

        <style>
          {`
            .search-results-header .medical-search-input .ant-input-affix-wrapper {
              border: 2px solid #1890ff !important;
              box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15) !important;
              height: 50px !important;
            }
            
            .search-results-header .medical-search-input .ant-btn {
              height: 50px !important;
              min-width: 120px !important;
              background: linear-gradient(135deg, #1890ff, #40a9ff) !important;
            }
          `}
        </style>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
            <span className="ml-3 text-lg">Đang phân tích và tìm kiếm...</span>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Left sidebar - Medical conditions */}
            <Col xs={24} lg={6}>
              <Card
                title={
                  <div className="flex items-center">
                    <ExperimentOutlined className="mr-2 text-blue-500" />
                    Dự đoán chẩn đoán
                  </div>
                }
                className="sticky top-4"
              >
                {medicalConditions.length > 0 ? (
                  <div className="space-y-4">
                    {medicalConditions.map(condition => (
                      <div key={condition.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Title level={5} className="mb-1">
                              {condition.name}
                            </Title>
                            <Text className="mb-2 block text-sm text-gray-600">{condition.description}</Text>
                            <div className="mb-2 flex items-center">
                              {getSpecialtyIcon(condition.specialty)}
                              <span className="ml-1 text-sm">{condition.specialty}</span>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-1">
                              {condition.symptoms.map(symptom => (
                                <Tag key={symptom} color="blue">
                                  {symptom}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Độ tin cậy:</span>
                          <Tag color={getConfidenceColor(condition.confidence)}>{condition.confidence}%</Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="Chưa có kết quả dự đoán" />
                )}
              </Card>
            </Col>

            {/* Right content - Tabs */}
            <Col xs={24} lg={18}>
              <Card>
                <Tabs defaultActiveKey="guidelines" size="large">
                  <TabPane
                    tab={
                      <span className="flex items-center text-lg">
                        <FileTextOutlined className="mr-2" />
                        Hướng dẫn sử dụng
                      </span>
                    }
                    key="guidelines"
                  >
                    {searchResults.guidelines.length > 0 ? (
                      <div className="space-y-6">
                        {searchResults.guidelines.map(guideline => (
                          <Card
                            key={guideline.id}
                            hoverable
                            className="border-l-4 border-l-blue-500 shadow-md transition-all hover:shadow-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Title level={4} className="mb-3 text-blue-700">
                                  📋 {guideline.title}
                                </Title>
                                <Paragraph className="mb-4 leading-relaxed text-gray-600">
                                  {guideline.summary}
                                </Paragraph>
                                <div className="flex items-center justify-between">
                                  <Text className="text-sm text-gray-500">🏥 Nguồn: {guideline.source}</Text>
                                  <Tag color="blue" className="px-3 py-1">
                                    ✅ Liên quan: {guideline.relevance}%
                                  </Tag>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Empty description="Chưa có hướng dẫn sử dụng" />
                    )}
                  </TabPane>

                  <TabPane
                    tab={
                      <span className="flex items-center text-lg">
                        <BookOutlined className="mr-2" />
                        Tài liệu tham khảo
                      </span>
                    }
                    key="references"
                  >
                    {searchResults.references.length > 0 ? (
                      <div className="space-y-6">
                        {searchResults.references.map(reference => (
                          <Card
                            key={reference.id}
                            hoverable
                            className="border-l-4 border-l-blue-500 shadow-md transition-all hover:shadow-lg"
                          >
                            <Title level={4} className="mb-3 text-blue-700">
                              📚 {reference.title}
                            </Title>
                            <div className="mb-3">
                              <Text className="text-sm text-gray-600">
                                👥 {reference.authors.join(', ')} - 📖 {reference.journal} ({reference.year})
                              </Text>
                            </div>
                            <Paragraph className="mb-4 leading-relaxed text-gray-600">{reference.abstract}</Paragraph>
                            <div className="flex flex-wrap gap-2">
                              {reference.keywords.map(keyword => (
                                <Tag key={keyword} color="blue" className="px-2 py-1">
                                  🔖 {keyword}
                                </Tag>
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Empty description="Chưa có tài liệu tham khảo" />
                    )}
                  </TabPane>

                  <TabPane
                    tab={
                      <span className="flex items-center text-lg">
                        <ExperimentOutlined className="mr-2" />
                        Khóa học CME
                      </span>
                    }
                    key="courses"
                  >
                    {searchResults.courses.length > 0 ? (
                      <div className="space-y-6">
                        {searchResults.courses.map(course => (
                          <Card
                            key={course.id}
                            hoverable
                            className="cursor-pointer border-l-4 border-l-orange-500 shadow-md transition-all hover:shadow-lg"
                            onClick={() => navigate(`/courses/${course.id}`)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Title level={4} className="mb-3 text-orange-700">
                                  🎓 {course.title}
                                </Title>
                                <Paragraph className="mb-4 leading-relaxed text-gray-600">
                                  {course.description}
                                </Paragraph>
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                  <div className="space-y-2">
                                    <div>
                                      <Text className="text-gray-500">👨‍⚕️ Giảng viên:</Text>
                                      <br />
                                      <Text className="font-medium">{course.instructor}</Text>
                                    </div>
                                    <div>
                                      <Text className="text-gray-500">⏱️ Thời lượng:</Text>
                                      <br />
                                      <Text className="font-medium">{course.duration}</Text>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <Text className="text-gray-500">🏆 Điểm CME:</Text>
                                      <br />
                                      <Tag color="blue" className="px-2 py-1">
                                        ⭐ {course.cmePoints} điểm
                                      </Tag>
                                    </div>
                                    <div>
                                      <Text className="text-gray-500">📊 Trình độ:</Text>
                                      <br />
                                      <Tag color="orange" className="px-2 py-1">
                                        🎯 {course.level}
                                      </Tag>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button className="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600">
                                    ➡️ Xem khóa học
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Empty description="Chưa có khóa học CME" />
                    )}
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        )}

        {/* No results */}
        {!loading && medicalConditions.length === 0 && searchQuery && (
          <div className="py-12 text-center">
            <Empty
              image={<SearchOutlined className="text-6xl text-gray-300" />}
              description={
                <div>
                  <Title level={4} className="text-gray-500">
                    Không tìm thấy kết quả cho "{searchQuery}"
                  </Title>
                  <Text className="text-gray-400">Vui lòng thử lại với từ khóa khác hoặc kiểm tra chính tả</Text>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalSearchPage;
