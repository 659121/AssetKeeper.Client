import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { User, UpdateUserRequest } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<User> {
  protected apiUrl = 'http://localhost:5261/api/admin/users';

  constructor(http: HttpClient) {
    super(http);
  }

  // Переопределяем update для работы с UpdateUserRequest
  override update(id: number, user: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  // Получить список всех доступных ролей с сервера
  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:5261/api/admin/roles');
  }
}