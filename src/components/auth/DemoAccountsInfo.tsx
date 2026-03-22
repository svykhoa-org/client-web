import { Card, Typography } from 'antd';

import { getMockUsers } from '@/mocks/auth';

const { Text } = Typography;

export const DemoAccountsInfo = () => {
  const mockUsers = getMockUsers();

  return (
    <Card title="Tài khoản demo" size="small" style={{ marginBottom: 16 }} className="border-blue-200 bg-blue-50">
      <div className="space-y-2">
        <Text className="block text-sm text-gray-600">Sử dụng các tài khoản sau để test:</Text>
        {mockUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <Text className="font-medium">{user.email}</Text>
            <Text className="text-gray-500">{user.password}</Text>
            <Text className="text-xs text-blue-600">({user.role})</Text>
          </div>
        ))}
      </div>
    </Card>
  );
};
