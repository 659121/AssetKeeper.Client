import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Department, 
  DeviceStatus, 
  MovementReason, 
  DepartmentStats 
} from '../models/reference.models';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  private baseUrl = 'http://localhost:5261/api/reference';

  constructor(private http: HttpClient) {}

  // Получить список отделов
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }

  // Создать отдел
  createDepartment(code: number, name: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/departments`, { code, name });
  }

  // Получить список статусов устройств
  getStatuses(): Observable<DeviceStatus[]> {
    return this.http.get<DeviceStatus[]>(`${this.baseUrl}/statuses`);
  }

  // Получить список причин перемещений
  getReasons(): Observable<MovementReason[]> {
    return this.http.get<MovementReason[]>(`${this.baseUrl}/reasons`);
  }

  // Создать причину перемещения
  createReason(code: string, name: string, description: string, sortOrder: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/reasons`, { 
      code, 
      name, 
      description, 
      sortOrder 
    });
  }

  // Получить статистику по отделам
  getStatistics(): Observable<DepartmentStats[]> {
    return this.http.get<DepartmentStats[]>(`${this.baseUrl}/statistics`);
  }
}