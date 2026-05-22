/**
 * Mirrors AbstractEntity from the backend.
 * All domain models extend this base.
 */
export interface BaseModel {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  createdBy?: string | null
  updatedBy?: string | null
}
