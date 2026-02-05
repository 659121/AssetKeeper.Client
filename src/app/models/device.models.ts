import { BaseEntity } from './base.models';

// Устройство
export interface Device {
  id: string;  // UUID
  name: string;
  inventoryNumber: string;
  description: string | null;
  currentDepartmentId: string | null;
  currentDepartmentName: string | null;
  currentStatusId: number;
  currentStatusName: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Создание устройства
export interface CreateDeviceRequest {
  name: string;
  inventoryNumber: string;
  description?: string | null;
  currentDepartmentId?: string | null;
  currentStatusId: number;
}

// Обновление устройства
export interface UpdateDeviceRequest {
  id: string;
  name?: string;
  inventoryNumber?: string;
  description?: string | null;
}

// Перемещение устройства
export interface MoveDeviceRequest {
  deviceId: string;
  toDepartmentId: string;
  reasonId: string;
  note?: string | null;
}

// История перемещения устройства
export interface DeviceMovement {
  id: string;
  movedAt: string;
  fromDepartmentName: string | null;
  toDepartmentName: string | null;
  reasonName: string | null;
  movedBy: string | null;
  note: string | null;
}

// Параметры запроса списка устройств
export interface DeviceQueryParams {
  departmentId?: string;
  statusId?: number;
  searchText?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

// Ответ с пагинацией
export interface DeviceListResponse {
  items: Device[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}