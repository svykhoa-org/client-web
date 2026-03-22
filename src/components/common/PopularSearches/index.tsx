import React from 'react';
import { useNavigate } from 'react-router';

import { FireOutlined, MedicineBoxOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

const { Text } = Typography;

interface PopularSearchesProps {
  className?: string;
}

const PopularSearches: React.FC<PopularSearchesProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const popularSearches = [
    { term: 'đau đầu', category: 'Triệu chứng', count: 1250 },
    { term: 'sốt cao', category: 'Triệu chứng', count: 890 },
    { term: 'ho khan', category: 'Triệu chứng', count: 756 },
    { term: 'paracetamol', category: 'Thuốc', count: 645 },
    { term: 'tim mạch', category: 'Chuyên khoa', count: 534 },
    { term: 'tiểu đường', category: 'Bệnh lý', count: 423 },
    { term: 'amoxicillin', category: 'Thuốc', count: 398 },
    { term: 'phụ sản', category: 'Chuyên khoa', count: 367 },
  ];

  const handleSearchClick = (term: string) => {
    navigate(`${RouteConfig.MedicalSearchPage.path}?q=${encodeURIComponent(term)}`);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Triệu chứng': 'red',
      'Bệnh lý': 'orange',
      Thuốc: 'green',
      'Chuyên khoa': 'blue',
    };
    return colors[category] || 'default';
  };

  return (
    <Card
      className={`popular-searches ${className}`}
      title={
        <div className="flex items-center">
          <FireOutlined className="mr-2 text-orange-500" />
          <span>Tìm kiếm phổ biến</span>
        </div>
      }
      extra={
        <Text className="text-sm text-gray-500">
          <SearchOutlined className="mr-1" />
          Hôm nay
        </Text>
      }
    >
      <div className="space-y-3">
        {popularSearches.map((search, index) => (
          <div
            key={search.term}
            className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
            onClick={() => handleSearchClick(search.term)}
          >
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {index + 1}
              </div>
              <div>
                <div className="flex items-center">
                  <MedicineBoxOutlined className="mr-2 text-blue-500" />
                  <Text className="font-medium">{search.term}</Text>
                </div>
                <div className="mt-1 flex items-center">
                  <Tag color={getCategoryColor(search.category)}>{search.category}</Tag>
                  <Text className="ml-2 text-xs text-gray-500">{search.count} lượt tìm</Text>
                </div>
              </div>
            </div>
            <SearchOutlined className="text-gray-400" />
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-4">
        <button
          className="w-full rounded-lg bg-green-50 py-3 text-center text-green-600 transition-all hover:scale-105 hover:bg-green-100"
          onClick={() => navigate(RouteConfig.MedicalSearchPage.path)}
        >
          <SearchOutlined className="mr-2" />
          🔍 Tìm kiếm nâng cao
        </button>
      </div>
    </Card>
  );
};

export default PopularSearches;
