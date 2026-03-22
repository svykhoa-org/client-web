import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router';

import { Alert, Empty, Spin, Tabs } from 'antd';

import SearchBar from '@/components/common/Header/src/SearchBar';

import { useSearching } from './hooks/useSearching';
import './styles.css';

export const MedicalSearchPage: React.FC = () => {
  const location = useLocation();

  const { loading, rawResult, error, handleSearch } = useSearching();

  useEffect(() => {
    if (location.state?.searchQuery) {
      handleSearch(location.state.searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  const renderContent = () => {
    if (!rawResult.trim()) {
      return (
        <div className="medical-search-empty">
          <Empty description="Không có kết quả" />
        </div>
      );
    }

    return (
      <div className="medical-search-content">
        <ReactMarkdown>{rawResult}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="container min-h-screen px-4">
      <div className="mb-8 flex w-full justify-center">
        <SearchBar placeholder="Nhập triệu chứng, tên bệnh cần tìm ..." onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="medical-search-loading">
          <Spin size="large" />
          <p className="medical-search-loading-text">Đang tìm kiếm thông tin, vui lòng chờ...</p>
        </div>
      ) : error ? (
        <div className="medical-search-empty">
          <Alert
            message="Lỗi tìm kiếm"
            description={error}
            type="error"
            showIcon
            action={
              <button className="ant-btn ant-btn-default" onClick={() => window.location.reload()}>
                Thử lại
              </button>
            }
          />
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <Tabs
            defaultActiveKey="1"
            className="medical-search-tabs"
            centered
            size="large"
            items={[
              {
                key: '1',
                label: <span className="px-4 py-2 text-base font-medium">📋 Hướng dẫn chuẩn đoán</span>,
                children: renderContent(),
              },
              {
                key: '2',
                label: <span className="px-4 py-2 text-base font-medium">📚 Tài liệu tham khảo</span>,
                children: (
                  <div className="medical-search-empty">
                    <Empty description="Tính năng đang phát triển" />
                  </div>
                ),
              },
              {
                key: '3',
                label: <span className="px-4 py-2 text-base font-medium">🎓 Khóa học CME</span>,
                children: (
                  <div className="medical-search-empty">
                    <Empty description="Tính năng đang phát triển" />
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
