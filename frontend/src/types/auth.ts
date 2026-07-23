export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface AuthUser {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string | null;
  avatar_url?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

export interface ProfileUpdatePayload {
  full_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
