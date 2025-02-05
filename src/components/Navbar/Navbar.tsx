import { useAuth } from "../../utils/AuthContext";
import { Link } from "react-router-dom";
import './Navbar.css';
import userImage from '../../assets/user.png';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo-navbar">Quizzy</Link>

      <div className="nav-elements">
        <Link to="/">Jouer</Link>
        <div className="welcome">
          {user && 
            <div className="user-info">
              <span>{user.username}</span>
              <img src={userImage} alt="avatar" />
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">Compte</Link>
                {isAdmin() && (
                  <Link to="/admin" className="dropdown-item">
                    Outils Admin
                  </Link>
                )}
                <button onClick={logout} className="dropdown-item">Déconnexion</button>
              </div>
            </div>
          }

          {!user && (
            <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
              Connexion
            </Link>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
