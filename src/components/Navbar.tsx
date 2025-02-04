import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-blue-500 text-white">
      <h1 className="text-xl font-bold">Mon Quiz</h1>
      <div className="flex items-center space-x-4">
        {user && <span>Bienvenue, {user.username}!</span>}
        
        {isAdmin() && (
          <Link to="/admin" className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
            Accès Admin
          </Link>
        )}

        {user ? (
          <button 
            onClick={logout} 
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
