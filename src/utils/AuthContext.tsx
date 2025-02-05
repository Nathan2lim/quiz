import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; 
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
    setIsLoading(false); 
  }, []);

  const login = (authData: AuthResponse) => {
    localStorage.setItem("user", JSON.stringify(authData.user));
    localStorage.setItem("token", authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    setUser(null);
    navigate("/login");
  };

  const isAdmin = () => {
    console.log(user?.role);
    return user?.role === "admin"; 
  };
  

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin  }}>
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

export default AuthContext;
