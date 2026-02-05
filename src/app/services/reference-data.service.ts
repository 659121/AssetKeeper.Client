import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Department, 
  DeviceStatus, 
  MovementReason, 
  DepartmentStats,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreateReasonRequest,
  UpdateReasonRequest
} from '../models/reference.models';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  private baseUrl = 'http://localhost:5261/api/reference';

  constructor(private http: HttpClient) {}

  // ============================================
  // Отделы
  // ============================================
  
  // Получить список отделов
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }

  // Создать отдел
  createDepartment(request: CreateDepartmentRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/departments`, request);
  }

  // Обновить отдел
  updateDepartment(id: string, request: UpdateDepartmentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/departments/${id}`, request);
  }

  // Удалить отдел
  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/departments/${id}`);
  }

  // ============================================
  // Статусы устройств
  // ============================================
  
  // Получить список статусов
  getStatuses(): Observable<DeviceStatus[]> {
    return this.http.get<DeviceStatus[]>(`${this.baseUrl}/statuses`);
  }

  // ============================================
  // Причины перемещений
  // ============================================
  
  // Получить список причин
  getReasons(): Observable<MovementReason[]> {
    return this.http.get<MovementReason[]>(`${this.baseUrl}/reasons`);
  }

  // Создать причину
  createReason(request: CreateReasonRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/reasons`, request);
  }

  // Обновить причину
  updateReason(id: string, request: UpdateReasonRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/reasons/${id}`, request);
  }

  // Удалить причину
  deleteReason(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reasons/${id}`);
  }

  // ============================================
  // Статистика
  // ============================================
  
  // Получить статистику по отделам
  getStatistics(): Observable<DepartmentStats[]> {
    return this.http.get<DepartmentStats[]>(`${this.baseUrl}/statistics`);
  }
}