import { useQuery } from '@tanstack/react-query';

import { getMyCourses } from '@/services/enrollment';

const queryKeys = {
  enrollment: {
    all: ['enrollment'],
    myCourses: () => [...queryKeys.enrollment.all, 'my-courses'],
  },
};

export const useMyCourses = () => {
  return useQuery({
    queryKey: queryKeys.enrollment.myCourses(),
    queryFn: async () => {
      const response = await getMyCourses();
      return response;
    },
    select: data => {
      // Handle array response or paginated response format from API
      if (Array.isArray(data.data)) {
        return data.data;
      }
      // If it's ListResponseData
      if (data.data && typeof data.data === 'object' && 'items' in data.data) {
        return data.data.items;
      }
      return [];
    },
  });
};
