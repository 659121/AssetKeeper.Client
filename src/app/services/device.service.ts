import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Device, 
  CreateDeviceRequest, 
  UpdateDeviceRequest, 
  MoveDeviceRequest, 
  DeviceMovement,
  DeviceQueryParams,
  DeviceListResponse
} from '../models/device.models';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:5261/api/devices';

  constructor(private http: HttpClient) {}

  // Получить список устройств с пагинацией и фильтрацией
  getAll(params?: DeviceQueryParams): Observable<DeviceListResponse> {
    let httpParams = new HttpParams();
    
    if (params?.departmentId) {
      httpParams = httpParams.set('DepartmentId', params.departmentId);
    }
    if (params?.statusId) {
      httpParams = httpParams.set('StatusId', params.statusId.toString());
    }
    if (params?.searchText) {
      httpParams = httpParams.set('SearchText', params.searchText);
    }
    if (params?.sortBy) {
      httpParams = httpParams.set('SortBy', params.sortBy);
    }
    if (params?.sortDescending !== undefined) {
      httpParams = httpParams.set('SortDescending', params.sortDescending.toString());
    }
    if (params?.page) {
      httpParams = httpParams.set('Page', params.page.toString());
    }
    if (params?.pageSize) {
      httpParams = httpParams.set('PageSize', params.pageSize.toString());
    }

    return this.http.get<DeviceListResponse>(this.apiUrl, { params: httpParams });
  }

  // Получить устройство по ID
  getById(id: string): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  // Создать устройство
  create(device: CreateDeviceRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, device);
  }

  // Обновить устройство
  update(device: UpdateDeviceRequest): Observable<void> {
    return this.http.put<void>(this.apiUrl, device);
  }

  // Удалить устройство
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Получить историю перемещений устройства
  getHistory(id: string): Observable<DeviceMovement[]> {
    return this.http.get<DeviceMovement[]>(`${this.apiUrl}/${id}/history`);
  }

  // Переместить устройство между отделами
  moveDevice(request: MoveDeviceRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/move`, request);
  }
}