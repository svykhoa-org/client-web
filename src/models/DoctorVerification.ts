// Effective verification status the server reports for the current user
// (includes derived `none`/`expired` on top of the record's own statuses).
export type UserVerificationStatus = 'none' | 'pending' | 'verified' | 'rejected' | 'expired'

export interface DoctorVerification {
  id: string
  userId: string
  fullNameOnLicense: string
  personalId: string
  licenseNumber: string
  scopeOfPractice: string
  issuingAuthority: string
  issuedDate: string
  expiryDate: string
  licenseFileAssetId: string
  workplace?: string | null
  academicTitle?: string | null
  phone?: string | null
  status: 'pending' | 'verified' | 'rejected'
  rejectionReason?: string | null
}

// Shape of GET /verification/me
export interface MyVerification {
  status: UserVerificationStatus
  verification: DoctorVerification | null
}

// Body of POST /verification
export interface SubmitVerificationInput {
  fullNameOnLicense: string
  personalId: string
  licenseNumber: string
  scopeOfPractice: string
  issuingAuthority: string
  issuedDate: string
  expiryDate: string
  licenseFileAssetId: string
  workplace?: string
  academicTitle?: string
  phone?: string
}
