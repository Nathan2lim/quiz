import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // ✅ Ajout de isLoading pour éviter la redirection prématurée
  login: (authData: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Ajout de isLoading
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
    setIsLoading(false); // ✅ Une fois les données récupérées, on arrête le chargement
  }, []);

  const login = (authData: AuthResponse) => {
    localStorage.setItem("user", JSON.stringify(authData.user));
    localStorage.setItem("token", authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ Supprime aussi le token pour éviter les accès non autorisés
    setUser(null);
    navigate("/login");
  };

  const isAdmin = () => {
    return user?.role === "admin"; // ✅ Vérifie si l'utilisateur est admin
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
