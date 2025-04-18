import { createContext, ReactNode, useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type User = {
  username: string;
  email: string;
  balance: number;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  token: string | undefined;
  user: User | null;
  login: (response: { access: string; refresh: string }) => void;
  logout: () => void;
  refreshUser: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const access = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access="))
    ?.split("=")[1];
  const [token, setToken] = useState<string | undefined>(access);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    const id = payload.user_id;

    fetch(`${BASE_URL}/api/user/${id}/`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [token]);

  function login(response: { access: string; refresh: string }) {
    document.cookie = `access=${response.access}; path=/; max-age=3600; SameSite=None; Secure`;
    document.cookie = `refresh=${response.refresh}; path=/; max-age=3600; SameSite=None; Secure;`;
    setToken(response.access);
  }

  function logout() {
    setToken(undefined);
    setUser(null);
    document.cookie = "access=; path=/; max-age=-1";
    document.cookie = "refresh=; path=/; max-age=-1";
  }

  function refreshUser() {
    if (!token) return;

    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    const id = payload.user_id;

    fetch(`${BASE_URL}/api/user/${id}/`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        token,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
