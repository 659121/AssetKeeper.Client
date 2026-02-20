import { Observable } from 'rxjs';

// Базовый интерфейс для всех сущностей
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Базовый интерфейс для CRUD операций
export interface IBaseCrudService<T extends BaseEntity> {
  getAll(): Observable<T[]>;
  getById(id: number): Observable<T>;
  create(item: Omit<T, 'id'>): Observable<T>;
  update(id: number, item: Partial<T>): Observable<T>;
  delete(id: number): Observable<void>;
}

// Конфигурация для таблиц
export interface TableConfig {
  columns: TableColumn[];
  actions?: TableAction[];
  pageSize?: number;
}

export interface TableColumn {
  key: string;
  title: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'custom';
  sortable?: boolean;
  width?: string;
  formatter?: (value: any) => string;
}

export interface TableAction {
  name: string;
  label: string;
  icon: string;
  color?: string;
  condition?: (item: any) => boolean;
}

// Конфигурация для модальных окон
export interface ModalConfig {
  title: string;
  fields: ModalField[];
  size?: 'sm' | 'md' | 'lg';
}

export interface ModalField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  required?: boolean;
  options?: { value: any; label: string }[];
  disabled?: boolean;
}

export interface PrintTransferData {
  // Данные устройства
  deviceName: string;
  inventoryNumber: string;
  serialNumber?: string | null;
  sticker?: string | null;

  // Данные перемещения
  fromDepartment: string | null;
  toDepartment: string;
  reason: string;
  movedAt: Date | string;
  movedBy: string | null;
  note?: string | null;
}