import type { User } from '@/models/User';
import { UserRole, UserStatus } from '@/models/User';

// Mock users database
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@medical-forum.com': {
    password: 'admin123',
    user: {
      _id: '1',
      fullName: 'Bác sĩ Nguyễn Văn Admin',
      email: 'admin@medical-forum.com',
      role: UserRole.Admin,
      status: UserStatus.Active,
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      bio: 'Quản trị viên hệ thống Medical Forum',
      specialization: 'Quản lý Y tế',
      certificates: ['Chứng chỉ Quản lý Bệnh viện', 'Thạc sĩ Y tế Công cộng'],
      workplaces: ['Bệnh viện Đa khoa Trung ương', 'Sở Y tế TP.HCM'],
      stats: {
        postCount: 45,
        followerCount: 1200,
        viewCount: 15000,
        rating: 4.9,
      },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    },
  },
  'doctor@medical-forum.com': {
    password: 'doctor123',
    user: {
      _id: '2',
      fullName: 'Bác sĩ Trần Thị Lan',
      email: 'doctor@medical-forum.com',
      role: UserRole.User,
      status: UserStatus.Active,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      bio: 'Bác sĩ chuyên khoa Nội tim mạch với 10 năm kinh nghiệm',
      specialization: 'Tim mạch',
      certificates: ['Chứng chỉ chuyên khoa Tim mạch cấp I', 'Chứng chỉ siêu âm tim'],
      workplaces: ['Bệnh viện Tim Hà Nội', 'Phòng khám Tim mạch ABC'],
      stats: {
        postCount: 128,
        followerCount: 856,
        viewCount: 12400,
        rating: 4.7,
      },
      createdAt: '2023-02-15T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    },
  },
  'user@medical-forum.com': {
    password: 'user123',
    user: {
      _id: '3',
      fullName: 'Nguyễn Văn User',
      email: 'user@medical-forum.com',
      role: UserRole.User,
      status: UserStatus.Active,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Sinh viên Y khoa năm cuối, đam mê nghiên cứu y học',
      specialization: 'Y học cơ sở',
      certificates: [],
      workplaces: ['Trường Đại học Y Hà Nội'],
      stats: {
        postCount: 24,
        followerCount: 156,
        viewCount: 2400,
        rating: 4.2,
      },
      createdAt: '2023-06-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    },
  },
};

// Mock authentication functions
export const mockLogin = async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const userRecord = mockUsers[email];

  if (!userRecord || userRecord.password !== password) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  return {
    user: userRecord.user,
    accessToken: `mock-token-${userRecord.user._id}-${Date.now()}`,
  };
};

export const mockRegister = async (userData: { name: string; email: string; password: string }): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Check if user already exists
  if (mockUsers[userData.email]) {
    throw new Error('Email đã được sử dụng');
  }

  // Create new user
  const newUser: User = {
    _id: `user-${Date.now()}`,
    fullName: userData.name,
    email: userData.email,
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
    bio: '',
    specialization: '',
    certificates: [],
    workplaces: [],
    stats: {
      postCount: 0,
      followerCount: 0,
      viewCount: 0,
      rating: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock database
  mockUsers[userData.email] = {
    password: userData.password,
    user: newUser,
  };

  return newUser;
};

export const mockLogout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real app, this would invalidate tokens on server
};

// Helper function to get mock users for testing
export const getMockUsers = () => {
  return Object.values(mockUsers).map(record => ({
    email: record.user.email,
    password:
      'Mật khẩu: ' +
      Object.keys(mockUsers)
        .find(email => mockUsers[email] === record)
        ?.split('@')[0] +
      '123',
    role: record.user.role,
    fullName: record.user.fullName,
  }));
};
