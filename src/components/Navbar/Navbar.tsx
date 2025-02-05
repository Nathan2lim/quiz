import { useAuth } from "../../utils/AuthContext";
import { Link } from "react-router-dom";
import './Navbar.css';
import userImage from '../../assets/user.png';
import axios from "axios";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [username, setUsername] = useState<string>("");

  axios.get(`http://localhost:5000/api/auth/${user?.id}`)
  .then((res) => setUsername(res.data.username))
  .catch((err) => console.error(err));


  return (
    <nav className="navbar">
      <Link to="/" className="logo-navbar">Quizzy</Link>

      <div className="nav-elements">
        <Link to="/">Jouer</Link>
        <div className="welcome">
          {user && 
            <div className="user-info">
              <span>{username}</span>
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
