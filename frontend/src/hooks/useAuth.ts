import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const cookies = document.cookie.split(";");
  const access = cookies.find((cookie) => cookie.trim().startsWith("access="));
  const [isAuthenticated, setIsAuthenticated] = useState(!!access);

  useEffect(() => {
    if (!path.startsWith("/dashboard") && isAuthenticated) {
      console.log("erm");
      navigate("/dashboard");
    } else if (path.startsWith("/dashboard") && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, path]);

  const login = (response: { access: string; refresh: string }) => {
    document.cookie = `access=${response.access}; path=/; max-age=3600`;
    document.cookie = `refresh=${response.refresh}; path=/; max-age=604800`;

    setIsAuthenticated(true);
  };

  const logout = () => {
    document.cookie = "access=; path=/; max-age=-1";
    document.cookie = "refresh=; path=/; max-age=-1";

    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
