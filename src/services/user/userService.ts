import { featuredUsers } from '@/mocks/featuredUsers';
import type { User } from '@/models/User';

// Define a simplified service response for mock data
interface ServiceResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const getFeaturedUsers = async (): Promise<ServiceResponse<User[]>> => {
  // Simulated API call with timeout
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data: featuredUsers,
        message: 'Featured users fetched successfully',
      });
    }, 500);
  });
};

export const getUserById = async (id: string): Promise<ServiceResponse<User | null>> => {
  // Simulated API call with timeout
  return new Promise(resolve => {
    setTimeout(() => {
      const user = featuredUsers.find(user => user._id === id);
      if (user) {
        resolve({
          success: true,
          data: user,
          message: 'User fetched successfully',
        });
      } else {
        resolve({
          success: false,
          data: null,
          message: 'User not found',
        });
      }
    }, 500);
  });
};
