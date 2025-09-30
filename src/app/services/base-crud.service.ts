import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, IBaseCrudService } from '../models/base.models';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<T extends BaseEntity> implements IBaseCrudService<T> {
  protected abstract apiUrl: string;

  constructor(protected http: HttpClient) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(item: Omit<T, 'id'>): Observable<T> {
    return this.http.post<T>(this.apiUrl, item);
  }

  update(id: number, item: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}