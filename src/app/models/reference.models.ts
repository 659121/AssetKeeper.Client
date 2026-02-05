// Отдел
export interface Department {
  id: string;
  code: number;
  name: string | null;
  isActive: boolean;
}

// Создание отдела
export interface CreateDepartmentRequest {
  code: number;
  name: string | null;
}

// Обновление отдела
export interface UpdateDepartmentRequest {
  id: string;
  code: number;
  name: string | null;
  isActive: boolean;
}

// Статус устройства
export interface DeviceStatus {
  id: number;
  code: string | null;
  name: string | null;
  sortOrder: number;
  isActive: boolean;
}

// Причина перемещения
export interface MovementReason {
  id: string;
  code: string | null;
  name: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

// Создание причины
export interface CreateReasonRequest {
  code: string | null;
  name: string | null;
  description: string | null;
  sortOrder: number;
}

// Обновление причины
export interface UpdateReasonRequest {
  id: string;
  code: string | null;
  name: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

// Статистика по отделам
export interface DepartmentStats {
  departmentId: string;
  departmentName: string | null;
  deviceCount: number;
  activeCount: number;
  repairCount: number;
}