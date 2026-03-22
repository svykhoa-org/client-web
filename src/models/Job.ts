import type { BaseModel } from './BaseModel';

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface Job extends BaseModel {
  title: string;
  description: string;
  status: JobStatus;
  location: string;
  company: string;
  salaryRange?: [
    number, // min salary
    number, // max salary
  ];
  expiresAt: Date;
  // Optional fields
  requirements?: string[];
  benefits?: string[];
  contactEmail?: string;
  contactPhone?: string;
  applyLink?: string;
}
