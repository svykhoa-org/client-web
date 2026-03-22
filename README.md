# SVYKHOA

Nền tảng học tập trực tuyến dành cho Sinh viên Y Khoa - Nơi chia sẻ kiến thức và kinh nghiệm về y học hiện đại

## Tính năng

- 🏠 Trang chủ với danh sách khóa học và tài liệu y khoa
- � Khóa học trực tuyến chuyên ngành y khoa
- 📝 Tài liệu y khoa chất lượng cao
- 🔍 Tìm kiếm và lọc khóa học, tài liệu theo danh mục
- 👥 Cộng đồng sinh viên y khoa trao đổi học tập
- 📱 Giao diện responsive, thân thiện mobile
- ⚡ Loading states với skeleton và spinner
- 🔄 Pagination và lazy loading
- 🎨 UI hiện đại với Tailwind CSS và Ant Design

## Công nghệ sử dụng

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Ant Design
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **State Management**: React Hooks + Custom hooks
- **Development**: ESLint, Prettier

## Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd medical_forum
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các giá trị phù hợp:

```env
VITE_API_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### 5. Build cho production

```bash
npm run build
```

## Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── ui/             # UI components cơ bản
│   ├── common/         # Header, Footer, etc.
│   └── post/           # Post-related components
├── pages/              # Các trang chính
├── services/           # API services
│   ├── httpClient.ts   # HTTP client configuration
│   ├── apiClient.ts    # API client utilities
│   ├── auth/           # Authentication services
│   ├── post/           # Post services
│   ├── category/       # Category services
│   └── comment/        # Comment services
├── config/             # Configuration files
│   ├── api.ts          # API configuration
│   └── env.ts          # Environment configuration
```

## API Integration

Dự án đã được tích hợp với backend API với base URL `http://localhost:3000/api/v1`. HTTP client tự động thêm prefix `/api/v1` cho tất cả requests.

### API Configuration

```typescript
// config/api.ts
export const apiConfig = {
  baseURL: 'http://localhost:3000', // từ env
  apiVersion: 'v1',
  // Tự động build thành: http://localhost:3000/api/v1
};
```

### Custom API Client

```typescript
// Sử dụng default client (api/v1)
import { httpClient } from '@/services/apiClient';
// Tạo custom client với version khác
import { createApiClient } from '@/services/apiClient';

const v2Client = createApiClient({ apiVersion: 'v2' });
const customClient = createApiClient({
  baseURL: 'https://api.other-service.com',
  apiVersion: 'v3',
});
```

### API Endpoints

**Base URL**: `http://localhost:3000/api/v1`

### Posts

- `GET /posts` - Lấy danh sách bài viết (có phân trang, lọc)
- `GET /posts/:id` - Lấy chi tiết bài viết
- `POST /posts` - Tạo bài viết mới
- `PUT /posts/:id` - Cập nhật bài viết
- `DELETE /posts/:id` - Xóa bài viết

### Categories

- `GET /categories` - Lấy danh sách danh mục
- `GET /categories/:id` - Lấy chi tiết danh mục

### Comments

- `GET /posts/:postId/comments` - Lấy bình luận của bài viết
- `POST /posts/:postId/comments` - Tạo bình luận mới
- `PUT /comments/:id` - Cập nhật bình luận
- `DELETE /comments/:id` - Xóa bình luận

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `GET /auth/me` - Lấy thông tin user hiện tại

## Các component mới

### AsyncLoading

Component để hiển thị loading states:

```tsx
<AsyncLoading loading={isLoading} type="spinner">
  <YourContent />
</AsyncLoading>

<AsyncLoading loading={isLoading} type="skeleton" skeleton={{ rows: 3, avatar: true }}>
  <YourContent />
</AsyncLoading>
```

### useAsyncState Hook

Hook để quản lý async operations:

```tsx
const { state, execute, reset } = useAsyncState<DataType>();

// Execute async function
await execute(() => fetchData());

// Access state
const { data, loading, error } = state;
```

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint
- `npm run format` - Format code với Prettier

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## License

MIT License
