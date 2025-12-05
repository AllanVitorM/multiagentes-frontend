"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../service/api";
import { Userlogin } from "../interface/user.login";

interface User {
  _id: string;
  name: string;
  email: string;
  enterprise?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: Userlogin) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me/", { withCredentials: true });
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (data: Userlogin) => {
    try {
      const response = await api.post("/auth/login", data, {
        withCredentials: true,
      });

      const { user } = response.data;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      console.error("Resposta completa:", error.response);
      throw new Error("Credenciais inválidas ou problemas no servidor");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", null, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
