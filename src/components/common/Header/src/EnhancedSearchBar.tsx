import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { AutoComplete, Input, type InputProps } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

interface SearchSuggestion {
  value: string;
  category: string;
  description?: string;
}

interface EnhancedSearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size: InputProps['size'];
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  placeholder = 'Tìm kiếm triệu chứng, bệnh lý, thuốc...',
  className = '',
  size,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock suggestions - sẽ được thay thế bằng API call thực
  const mockSuggestions = useMemo(
    () => [
      { value: 'đau đầu', category: 'Triệu chứng', description: 'Triệu chứng đau ở vùng đầu' },
      { value: 'ho khan', category: 'Triệu chứng', description: 'Ho không có đờm' },
      { value: 'sốt cao', category: 'Triệu chứng', description: 'Nhiệt độ cơ thể tăng cao' },
      { value: 'tiểu đường', category: 'Bệnh lý', description: 'Bệnh lý về đường huyết' },
      { value: 'tăng huyết áp', category: 'Bệnh lý', description: 'Huyết áp cao' },
      { value: 'paracetamol', category: 'Thuốc', description: 'Thuốc giảm đau hạ sốt' },
      { value: 'amoxicillin', category: 'Thuốc', description: 'Thuốc kháng sinh' },
      { value: 'phụ sản', category: 'Chuyên khoa', description: 'Khoa phụ sản' },
      { value: 'tim mạch', category: 'Chuyên khoa', description: 'Khoa tim mạch' },
    ],
    []
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (value: string) => {
      if (!value.trim()) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Simulate API delay
      const timeoutId = setTimeout(() => {
        try {
          // TODO: Replace with actual API call
          // const response = await medicalSearchService.getSuggestions(value);

          const filteredSuggestions = mockSuggestions.filter(
            suggestion =>
              suggestion.value.toLowerCase().includes(value.toLowerCase()) ||
              suggestion.category.toLowerCase().includes(value.toLowerCase())
          );

          setSuggestions(filteredSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [mockSuggestions]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchValue);
    return cleanup;
  }, [searchValue, debouncedSearch]);

  const handleSearch = (value: string) => {
    if (!value.trim()) return;

    // Navigate to search results page
    navigate(`${RouteConfig.MedicalSearchPage.path}?q=${encodeURIComponent(value.trim())}`);

    // Clear suggestions
    setSuggestions([]);

    // Call parent onSearch if provided
    onSearch?.(value);
  };

  const handleSelect = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
  };

  // Format options for AutoComplete
  const options = suggestions.map(suggestion => ({
    value: suggestion.value,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 500 }}>{suggestion.value}</div>
          {suggestion.description && <div style={{ fontSize: '12px', color: '#666' }}>{suggestion.description}</div>}
        </div>
        <span
          style={{
            background: '#f0f0f0',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          {suggestion.category}
        </span>
      </div>
    ),
  }));

  return (
    <div className={className}>
      <AutoComplete
        value={searchValue}
        options={options}
        onSelect={handleSelect}
        onSearch={handleInputChange}
        notFoundContent={loading ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả'}
        placeholder={placeholder}
        style={{ width: '100%' }}
        size={size}
      >
        <Input.Search size={size} enterButton="Tìm kiếm" onSearch={handleSearch} loading={loading} />
      </AutoComplete>
    </div>
  );
};

export default EnhancedSearchBar;
