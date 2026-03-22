import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const { Search } = Input;

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Tìm kiếm bài viết, chủ đề...' }) => {
  return (
    <div className="w-full max-w-xl">
      <Search
        placeholder={placeholder}
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={onSearch}
        className="w-full"
        style={{
          backgroundColor: 'white',
        }}
      />
    </div>
  );
};

export default SearchBar;
