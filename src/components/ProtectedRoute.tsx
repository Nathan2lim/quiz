import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    console.log("ProtectedRoute - isLoading:", isLoading, "User:", user);
    
    if (isLoading) return null; // ✅ Attendre que le chargement soit terminé
    return user ? children : <Navigate to="/login" replace />;
    
};

export default ProtectedRoute;
