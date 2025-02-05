import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import './Admin.css';

const Admin = () => {
    return (
        <div className="main">
            <Navbar />
            <div className="AdminContainer">
                <h1>Outils admin</h1>
                <p>Que voulez vous faire ?</p>

                <div className="admin-buttons">
                    <Link to="/create-quiz" className="admin-button">
                        Créer un quiz
                    </Link>
                    <Link to="/users" className="admin-button">
                        Gestion des utilisateurs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Admin;