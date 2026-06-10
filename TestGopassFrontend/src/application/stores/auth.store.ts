import { create } from 'zustand';
import { User, Role, LoginCredentials, RegisterData, AuthResponse, canUserPerform } from '@/domain/entities/user.entity';
import { apiClient } from '@/infrastructure/api/api.client';
import { Result, DomainError, NetworkError } from '@/domain/types/result';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<Result<AuthResponse, DomainError>>;
  register: (data: RegisterData) => Promise<Result<AuthResponse, DomainError>>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkPermission: (resource: 'projects' | 'tasks' | 'users', action: string) => boolean;
  isAdmin: () => boolean;
  clearError: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials: LoginCredentials): Promise<Result<AuthResponse, DomainError>> => {
      set({ isLoading: true, error: null });

      const result = await Result.fromAsync(async () => {
        return await apiClient.post<AuthResponse>('/auth/login', credentials, {
          withCredentials: true,
        });
      });

      if (Result.isOk(result)) {
        const response = result.data;
        apiClient.setAuthToken(response.accessToken);
        set({
          user: response.user,
          token: response.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return Result.ok(response);
      }

      const error = new NetworkError(result.error.message || 'Login failed');
      set({ error: error.message, isLoading: false });
      return Result.fail(error);
    },

    register: async (data: RegisterData): Promise<Result<AuthResponse, DomainError>> => {
      set({ isLoading: true, error: null });

      const result = await Result.fromAsync(async () => {
        return await apiClient.post<AuthResponse>('/auth/register', data, {
          withCredentials: true,
        });
      });

      if (Result.isOk(result)) {
        set({ isLoading: false });
        return Result.ok(result.data);
      }

      const error = new NetworkError(result.error.message || 'Registration failed');
      set({ error: error.message, isLoading: false });
      return Result.fail(error);
    },

    logout: async () => {
      try {
        await apiClient.post('/auth/logout', {}, { withCredentials: true });
      } catch {
      }
      apiClient.setAuthToken(null);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    refreshToken: async (): Promise<boolean> => {
      try {
        const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {}, {
          withCredentials: true,
        });
        set({ token: response.accessToken });
        return true;
      } catch {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        return false;
      }
    },

    setToken: (token: string) => {
      set({ token });
    },

    checkPermission: (resource: 'projects' | 'tasks' | 'users', action: string): boolean => {
      const { user } = get();
      if (!user) return false;
      return canUserPerform(user.role, resource, action);
    },

    isAdmin: (): boolean => {
      const { user } = get();
      return user?.role === Role.ADMIN;
    },

    clearError: () => {
      set({ error: null });
    },
  })
);
