import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();

  console.log("AdminRoute - isLoading:", isLoading, "User:", user);

  if (isLoading) return null; // ✅ Attendre le chargement des données avant d'afficher quoi que ce soit

  return isAdmin() ? children : <Navigate to="/" replace />; // ✅ Redirige les non-admins
};

export default AdminRoute;
