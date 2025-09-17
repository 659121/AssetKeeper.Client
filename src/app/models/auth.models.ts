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
  role: string;
}

export interface DecodedToken {
  sub: string;
  username: string;
  role: string;
  exp: number;
  iss: string;
  aud: string;
}