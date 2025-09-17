// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from "./api/auth";
import type {
  ApiResponse,
  // LoginCredentials,
  // LoginStartRequest,
  // LoginStartResponse,
  // LoginFinishRequest,
  // LoginFinishResponse,
  LogoutResponse,
  // RegisterData,
  // RegisterResponse,
} from "./api/types";

type User = { id: string; username: string } | null;
type AuthCtx = {
  user: User; loading: boolean; isAuthenticated: boolean;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<ApiResponse<LogoutResponse>>;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = React.useCallback(async () => {
    const res = await authApi.getUser();                // returns { success, data? }
    setUser(res.success ? (res.data ?? null) : null);
  }, []);

  useEffect(() => { (async () => { await refresh(); setLoading(false); })(); }, [refresh]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    if (response.success) await refresh();
    return response.success;
  };

  const logout = async () => {
    const response = await authApi.logout();
    setUser(null)
    return response;
  };

  return (
    <Ctx.Provider value={{
      user,
      loading,
      isAuthenticated: user !== null,
      refresh,
      login,
      logout
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
