import React, { createContext, useContext, useEffect, useState } from "react";
import { customHash } from "../utils/utils";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("auth") === "true";
  });

  const validateSession = () => {
    const session = sessionStorage.getItem("auth");
    setIsAuthenticated(session === "true");
  };

  const login = (username: string, password: string) => {
    const hashedPassword = customHash(password);
    localStorage.setItem(
      "user",
      JSON.stringify({ username, password: hashedPassword })
    );

    sessionStorage.setItem("auth", "true");
    localStorage.setItem("auth-broadcast", JSON.stringify({ type: "login" }));
    setIsAuthenticated(true);
    return true;

    // const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    // const hashedPassword = customHash(password);
    // if (
    //   storedUser.username === username &&
    //   storedUser.password === hashedPassword
    // ) {
    //   sessionStorage.setItem("auth", "true");
    //   localStorage.setItem("auth-broadcast", JSON.stringify({ type: "login" }));
    //   setIsAuthenticated(true);
    //   return true;
    // }
    // return false;
  };


  const logout = () => {
    sessionStorage.removeItem("auth");
    localStorage.setItem("auth-broadcast", JSON.stringify({ type: "logout" }));
    setIsAuthenticated(false);
  };

  useEffect(() => {
    validateSession();
    const typeData = localStorage.getItem("auth-broadcast");
    console.log("type", typeData);

    if (typeData) {
      const { type } = JSON.parse(typeData);

      if (type === "login") {
        sessionStorage.setItem("auth", "true");
      } else {
        sessionStorage.removeItem("auth");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login,  logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
