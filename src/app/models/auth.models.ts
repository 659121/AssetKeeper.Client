export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  roles: string[];
}

export interface DecodedToken {
  sub: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string | string[]; // Может быть строкой или массивом
  exp: number;
  iss: string;
  aud: string;
}