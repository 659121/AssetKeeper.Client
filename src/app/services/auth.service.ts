import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User, DecodedToken } from '../models/auth.models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5261/api/auth'; // Замените на ваш URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Проверяем, есть ли пользователь в localStorage
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

    // Декодирование JWT токена
  private decodeToken(token: string): DecodedToken {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Преобразование decoded token в User object
  private tokenToUser(decodedToken: DecodedToken): User {
    return {
      id: parseInt(decodedToken.sub),
      username: decodedToken.username,
      role: decodedToken.role
    };
  }

  // Проверка срока действия токена
  private isTokenExpired(decodedToken: DecodedToken): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  // Получить текущего пользователя
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Вход в систему
  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  // Регистрация
  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  // Сохраняем данные пользователя из токена
  setUserData(token: string): void {
    try {
      const decodedToken = this.decodeToken(token);
      
      // Проверяем срок действия токена
      if (this.isTokenExpired(decodedToken)) {
        this.logout();
        throw new Error('Token expired');
      }

      const user = this.tokenToUser(decodedToken);
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error setting user data:', error);
      this.logout();
    }
  }

  // Выход из системы
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  // Получить токен из localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Проверяем валидность токена при инициализации
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.decodeToken(token);
        if (!this.isTokenExpired(decodedToken)) {
          const user = this.tokenToUser(decodedToken);
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  // Проверяем роль пользователя
  hasRole(requiredRole: string): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    return user.role.toLowerCase() === requiredRole.toLowerCase();
  }

  // Проверяем любую из требуемых ролей
  hasAnyRole(requiredRoles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    // Приводим роли к нижнему регистру для case-insensitive сравнения
    const userRole = user.role.toLowerCase();
    return requiredRoles.some(role => role.toLowerCase() === userRole);
  }

  // Проверяем все требуемые роли
  hasAllRoles(requiredRoles: string[]): boolean {
  const user = this.currentUserValue;
  return user ? requiredRoles.every(role => user.role === role) : false;
  }
}