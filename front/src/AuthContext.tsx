// AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { authApi } from "./api/auth";
import type {
  ApiResponse,
  LoginFinishResponse,
  // LoginCredentials,
  // LoginStartRequest,
  // LoginStartResponse,
  // LoginFinishRequest,
  // LoginFinishResponse,
  LogoutResponse,
} from "./api/types";

type User = { id: string; username: string } | null;
type AuthCtx = {
  timeStart: number;
  timeEnd: number;
  timeRemain: number;
  //timeRefresh: () => Promise<void>;
  user: User;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<ApiResponse<LoginFinishResponse>>;
  logout: () => Promise<ApiResponse<LogoutResponse>>;
};



const Ctx = createContext<AuthCtx | null>(null);



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [timeStart, setTimeStart] = useState<number>(0);
  const [timeEnd, setTimeEnd] = useState<number>(0);
  const [timeRemain, setTimeRemain] = React.useState(0);

  React.useEffect(() => {
    if (!timeEnd) { setTimeRemain(0); return; }
    if (timeStart && Date.now() < timeStart) { setTimeRemain(0); return; }
    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, timeEnd - now);
      setTimeRemain(left);
      console.log('AuthProvider.tsx > left:', left);
      return left;
    };
    let left = tick();
    const id = setInterval(() => {
      left = tick();
      if (left === 0) {
        console.log('AuthProvider.tsx > left===0');
        logout()
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timeStart, timeEnd]);



  const refresh = React.useCallback(async () => {
    const res = await authApi.getUser(); // returns { success, data? }
    setUser(res.success ? (res.data ?? null) : null);
  }, []);



  // useEffect(() => {
  //   (async () => {
  //     await refresh();
  //     setLoading(false);
  //   })();
  // }, [refresh]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    //if (response.success) await refresh();
    if (response.success && response.iat && response.exp) {
      await refresh();
      setTimeStart(response.iat);
      setTimeEnd(response.exp);
      localStorage.setItem('timeStart', JSON.stringify(Date.now()));
    }
    return response;
  };

  const logout = async () => {
    console.log('AuthProvider.tsx > logout()');
    const response = await authApi.logout();
    setUser(null);
    setTimeStart(0);
    setTimeEnd(0);
    return response;
  };

  return (
    <Ctx.Provider
      value={{
        timeStart,
        timeEnd,
        timeRemain,
        //timeRefresh,
        user,
        isAuthenticated: user !== null,
        refresh,
        login,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
