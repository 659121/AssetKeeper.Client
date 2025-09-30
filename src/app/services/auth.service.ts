import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User, DecodedToken } from '../models/auth.models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5261/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
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
    // Обрабатываем роль как строку или как массив
    let roles: string[] = [];
    
    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    if (Array.isArray(roleClaim)) {
      // Если роль пришла как массив
      roles = roleClaim;
    } else if (typeof roleClaim === 'string') {
      // Если роль пришла как строка
      roles = [roleClaim];
    } else if (roleClaim) {
      // Если роль пришла в другом формате, преобразуем в строку
      roles = [String(roleClaim)];
    }
    
    return {
      id: parseInt(decodedToken.sub),
      username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      roles: roles
    };
  }

  // Проверка срока действия токена
  private isTokenExpired(decodedToken: DecodedToken): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

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

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

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

  // Проверяем одну роль
  hasRole(requiredRole: string): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(requiredRole) : false;
  }

  // Проверяем любую из требуемых ролей
  hasAnyRole(requiredRoles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    return requiredRoles.some(role => user.roles.includes(role));
  }

  // Проверяем все требуемые роли
  hasAllRoles(requiredRoles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    return requiredRoles.every(role => user.roles.includes(role));
  }
}