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
        const response = await api.get("/auth/me/");
        setUser(response.data);
      } catch (err) {
        setUser(null);
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
      console.error("Erro ao fazer login: ", error.response?.data);
      throw new Error("Credenciais inválidas ou problemas no servidor");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
