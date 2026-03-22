import { z } from 'zod';

// Schema validation cho form đăng ký ứng tuyển
export const jobApplicationSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được vượt quá 100 ký tự'),

  dateOfBirth: z
    .string()
    .min(1, 'Ngày sinh là bắt buộc')
    .refine(date => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 65;
    }, 'Tuổi phải từ 18 đến 65'),

  address: z
    .string()
    .min(1, 'Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được vượt quá 200 ký tự'),

  educationLevel: z.string().min(1, 'Trình độ học vấn là bắt buộc'),

  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),

  school: z
    .string()
    .min(1, 'Tên trường học là bắt buộc')
    .min(5, 'Tên trường học phải có ít nhất 5 ký tự')
    .max(150, 'Tên trường học không được vượt quá 150 ký tự'),

  major: z
    .string()
    .min(1, 'Chuyên ngành là bắt buộc')
    .min(3, 'Chuyên ngành phải có ít nhất 3 ký tự')
    .max(100, 'Chuyên ngành không được vượt quá 100 ký tự'),

  cvFile: z
    .any()
    .refine(files => files?.length > 0, 'File CV là bắt buộc')
    .refine(
      files => files?.[0]?.size <= 5000000, // 5MB
      'Kích thước file CV không được vượt quá 5MB'
    )
    .refine(
      files =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(files?.[0]?.type),
      'File CV phải có định dạng PDF, DOC hoặc DOCX'
    ),

  introduction: z
    .string()
    .min(1, 'Giới thiệu bản thân là bắt buộc')
    .min(50, 'Giới thiệu bản thân phải có ít nhất 50 ký tự')
    .max(1000, 'Giới thiệu bản thân không được vượt quá 1000 ký tự'),
});

// Type cho form data
export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

// Options cho trình độ học vấn
export const educationLevelOptions = [
  { value: 'high-school', label: 'Trung học phổ thông' },
  { value: 'college', label: 'Cao đẳng' },
  { value: 'bachelor', label: 'Cử nhân' },
  { value: 'master', label: 'Thạc sĩ' },
  { value: 'phd', label: 'Tiến sĩ' },
  { value: 'other', label: 'Khác' },
];
