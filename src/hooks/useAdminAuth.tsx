import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/content?mode=draft", {
        credentials: "include"
      });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(password: string) {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      setIsAuthenticated(true);
      navigate("/admin/editor");
      return true;
    }
    return false;
  }

  function logout() {
    fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
    setIsAuthenticated(false);
    navigate("/admin");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AuthProvider");
  return context;
}