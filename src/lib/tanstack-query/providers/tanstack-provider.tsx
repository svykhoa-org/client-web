import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Thử lại 1 lần nếu lỗi
      refetchOnWindowFocus: false, // Tránh fetch lại khi switch tab
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "mới" trong 5 phút
      gcTime: 1000 * 60 * 10, // Giữ trong cache 10 phút trước khi xóa hẳn
    },
  },
});

export const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
