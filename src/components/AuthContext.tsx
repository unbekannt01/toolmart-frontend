/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  role: string | null;
}

interface DecodedToken {
  id: string;
  role: string;
  jti: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [role, setRole] = useState<string | null>(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.role || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    const decoded: DecodedToken = jwtDecode(token);
    setRole(decoded.role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setRole(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
