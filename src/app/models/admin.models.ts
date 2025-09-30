import { BaseEntity } from './base.models';

export interface User extends BaseEntity {
  username: string;
  isActive: boolean;
  roles: string[];
  lastLogin?: string;
}

export interface UpdateUserRequest {
  isActive?: boolean | null;
  roles?: string[] | null;
}