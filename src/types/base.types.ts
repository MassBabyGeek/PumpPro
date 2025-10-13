/**
 * Base types for all API entities
 * Contains common audit fields returned by the API
 */

/**
 * Nullable time field from Go's sql.NullTime
 */
export interface NullableTime {
  Time: string;
  Valid: boolean;
}

/**
 * Base entity with audit fields
 * All entities from the API extend this type
 */
export interface BaseEntity {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: NullableTime;
  deletedBy?: string;
}
