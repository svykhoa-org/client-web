import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UploadOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Col, DatePicker, Form, Input, Row, Select, Upload, message } from 'antd';
import { type UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

import { type JobApplicationFormData, educationLevelOptions, jobApplicationSchema } from '../schema/jobSchema';

const { TextArea } = Input;

interface FormRegistrationProps {
  onSubmit?: (data: JobApplicationFormData) => void;
  initialValues?: Partial<JobApplicationFormData>;
  onSuccess?: () => void;
}

export const FormRegistration = ({ onSubmit, initialValues, onSuccess }: FormRegistrationProps) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      educationLevel: '',
      email: '',
      school: '',
      major: '',
      cvFile: undefined,
      introduction: '',
      ...initialValues,
    },
  });

  const handleFormSubmit = async (data: JobApplicationFormData) => {
    if (onSubmit) {
      try {
        setLoading(true);
        await onSubmit(data);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.log('Error submitting form:', error);
        message.error('Đăng ký ứng tuyển thất bại!');
      } finally {
        setLoading(false);
      }
    } else {
      // Default behavior: log form data
      console.log('Form data:', data);
      message.success('Đăng ký ứng tuyển thành công!');
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleCVUpload = (info: { fileList: UploadFile[] }) => {
    const { fileList } = info;
    setValue('cvFile', fileList);
  };

  const beforeUpload = (file: File) => {
    const isValidType = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(file.type);

    if (!isValidType) {
      message.error('Chỉ được upload file PDF, DOC hoặc DOCX!');
      return false;
    }

    const isValidSize = file.size / 1024 / 1024 < 5;
    if (!isValidSize) {
      message.error('File không được vượt quá 5MB!');
      return false;
    }

    return false; // Prevent automatic upload
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Họ tên"
            validateStatus={errors.fullName ? 'error' : ''}
            help={errors.fullName?.message}
            required
          >
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nhập họ tên của bạn" />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngày sinh"
            validateStatus={errors.dateOfBirth ? 'error' : ''}
            help={errors.dateOfBirth?.message}
            required
          >
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={date => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                  style={{ width: '100%' }}
                />
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Địa chỉ" validateStatus={errors.address ? 'error' : ''} help={errors.address?.message} required>
        <Controller
          name="address"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Nhập địa chỉ của bạn" />}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Trình độ học vấn"
            validateStatus={errors.educationLevel ? 'error' : ''}
            help={errors.educationLevel?.message}
            required
          >
            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Chọn trình độ học vấn" options={educationLevelOptions} />
              )}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message} required>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} type="email" placeholder="Nhập email của bạn" />}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Trường học"
            validateStatus={errors.school ? 'error' : ''}
            help={errors.school?.message}
            required
          >
            <Controller
              name="school"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nhập tên trường học" />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Chuyên ngành"
            validateStatus={errors.major ? 'error' : ''}
            help={errors.major?.message}
            required
          >
            <Controller
              name="major"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nhập chuyên ngành" />}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="File CV"
        validateStatus={errors.cvFile ? 'error' : ''}
        help={errors.cvFile?.message ? String(errors.cvFile.message) : undefined}
        required
      >
        <Controller
          name="cvFile"
          control={control}
          render={() => (
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleCVUpload}
              accept=".pdf,.doc,.docx"
              maxCount={1}
              fileList={watch('cvFile') || []}
            >
              <Button icon={<UploadOutlined />}>Chọn file CV</Button>
            </Upload>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Giới thiệu bản thân"
        validateStatus={errors.introduction ? 'error' : ''}
        help={errors.introduction?.message}
        required
      >
        <Controller
          name="introduction"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={6}
              placeholder="Hãy giới thiệu về bản thân, kinh nghiệm, kỹ năng và mục tiêu nghề nghiệp của bạn..."
              showCount
              maxLength={1000}
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Row gutter={16}>
          <Col>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Gửi đơn ứng tuyển
            </Button>
          </Col>
          <Col>
            <Button type="default" onClick={handleReset} size="large">
              Làm mới
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};
