export type UserRole = 'ADMIN' | 'DONOR' | 'RECEIVER' | 'VOLUNTEER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Exclude<UserRole, 'ADMIN'>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData extends AuthTokens {
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
