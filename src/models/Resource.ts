import type { BaseModel } from './BaseModel';
import type { Category } from './Category';
import type { User } from './User';

export enum ResourceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ResourceSocialLinks {
  facebook?: string;
  zalo?: string;
  website?: string;
}

export interface Resource extends BaseModel {
  title: string;
  fileUrl: string;
  description?: string;
  uploaderId: string;
  categoryId: string;
  price: number;
  currency: string;
  status: ResourceStatus;
  downloadCount: number;
  fileSize?: number;
  fileType?: string;
  thumbnail?: string;
  previewImages?: string[];
  tags?: string[];
  avgRating?: number;
  totalReviews?: number;
  soldCount?: number;

  // New fields for enhanced UX
  isFree?: boolean;
  licenseType?: string;
  validityPeriod?: number;
  featured?: boolean;
  previewContent?: string;
  reviewSummary?: ReviewSummary;
  authorBio?: string;
  socialLinks?: ResourceSocialLinks;

  // Relationships
  uploader?: User;
  category?: Category;
}
