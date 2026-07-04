import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { storage } from '@/utils/storage';
import type { LoginRequest, RegisterRequest, User } from '@/types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getUser());

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data);
    const { accessToken, refreshToken, user: authUser } = response.data.data;
    storage.setTokens({ accessToken, refreshToken });
    storage.setUser(authUser);
    setUser(authUser);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    const { accessToken, refreshToken, user: authUser } = response.data.data;
    storage.setTokens({ accessToken, refreshToken });
    storage.setUser(authUser);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    storage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
