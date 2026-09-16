import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { apiClient, tokenStorage } from '@/services/api/api-client';
import { endpoints } from '@/services/api/endpoint';
import type { Role } from '@/types/dtr';

// ============ Types ============
interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
}

interface AuthStatusResponse {
  user: User;
  token: string;
}

// ============ Context ============
const AuthContext = createContext<AuthContextValue | null>(null);

// ============ Provider ============
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    // Check for mock user first (demo mode)
    const mockUserStr = localStorage.getItem('dtr_mock_user');
    const mockToken = localStorage.getItem('dtr_token');
    
    if (mockUserStr && mockToken?.startsWith('demo-token-')) {
      try {
        const mockUser = JSON.parse(mockUserStr);
        setState({
          user: mockUser,
          role: mockUser.role,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } catch {
        // Invalid mock user data - continue to real auth check
      }
    }

    const token = tokenStorage.get();
    if (!token) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await apiClient.get<AuthStatusResponse>(
        endpoints.auth.status
      );
      const { user } = response.data;

      setState({
        user,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      // Token invalid or expired
      tokenStorage.remove();
      localStorage.removeItem('dtr_mock_user');
      setState({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post<AuthStatusResponse>(
        endpoints.auth.login,
        credentials
      );
      const { user, token } = response.data;

      tokenStorage.set(token);

      setState({
        user,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post<AuthStatusResponse>(
        endpoints.auth.register,
        data
      );
      const { user, token } = response.data;

      tokenStorage.set(token);

      setState({
        user,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(endpoints.auth.logout);
    } finally {
      tokenStorage.remove();
      localStorage.removeItem('dtr_mock_user');
      setState({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const updateUser = useCallback((userUpdate: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userUpdate } : null,
    }));
  }, []);

  const refreshAuth = useCallback(async () => {
    await checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============ Hook ============
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

// ============ Selectors (optional helpers) ============
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useUserRole() {
  const { role } = useAuth();
  return role;
}
