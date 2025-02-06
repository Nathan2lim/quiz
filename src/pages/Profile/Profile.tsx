import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import QuizHistoryTabComponent from "../../components/QuizHistoryTab/QuizHistoryTab";
import InputComponent from "../../components/Input/Input"; // Import InputComponent
import "./Profile.css";

interface Quiz {
  quizId: string;
  score: number;
  total: number;
  date: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  quizzes: Quiz[];
  averageScorePerQuiz: Record<string, number>;
  generalAverage: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>(user?.username || "");
  const [newEmail, setNewEmail] = useState<string>(user?.email || "");
  const [message, setMessage] = useState<string>("");
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token
        if (!token) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setNewEmail(res.data.user.email); // Set the current email
        setNewUsername(res.data.user.username); // Set the current username
      } catch (err) {
        setError("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprimer le token
    window.location.href = "/login"; // Rediriger vers la page de connexion
  };

  const handleUsernameUpdate = async () => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Erreur lors de la mise à jour.");
      } else {
        setMessage("Nom d'utilisateur mis à jour avec succès !");
        setUser({ ...user, username: newUsername });
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  const handleEmailUpdate = async () => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Erreur lors de la mise à jour.");
      } else {
        setMessage("Email mis à jour avec succès !");
        const data = await response.json();
        setUser({ ...user, email: data.email });
        console.log(user.email);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  const validateNewPassword = (password: string) => {
    if (password.length < 8 || password.length > 26) {
      setNewPasswordError("Le mot de passe doit contenir entre 8 et 26 caractères.");
    } else {
      setNewPasswordError(null);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user || newPasswordError) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, password: newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Erreur lors de la mise à jour du mot de passe.");
      } else {
        setMessage("Mot de passe mis à jour avec succès !");
        setOldPassword("");
        setNewPassword("");
        setShowPasswordFields(false);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="main">
      <Navbar />
      <div className="ProfileContainer">
        <h2>Bonjour {user?.username} !</h2>
        <div className="AccountSection">
          <h2>Informations personnelles</h2>
          <div className="AccountSectionInputs">
            <InputComponent
              label="Nom d'utilisateur"
              name="username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button onClick={handleUsernameUpdate}>Mettre à jour</button>
          </div>
          <div className="AccountSectionInputs">
            <InputComponent 
              label="Email" 
              name="email" 
              type="email" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button onClick={handleEmailUpdate}>Mettre à jour</button>
          </div>
          <div className="AccountSectionInputs column">
            <button onClick={() => setShowPasswordFields(!showPasswordFields)}>
              {showPasswordFields ? "Annuler" : "Modifier le mot de passe"}
            </button>
            {showPasswordFields && (
              <>
                <InputComponent
                  label="Ancien mot de passe"
                  name="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputComponent
                  label="Nouveau mot de passe"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    validateNewPassword(e.target.value);
                  }}
                  className={newPasswordError ? "input-error" : ""}
                />
                {newPasswordError && <p className="error-message">{newPasswordError}</p>}
                <button onClick={handlePasswordUpdate}>Mettre à jour</button>
              </>
            )}
          </div>
          {message && <p>{message}</p>}

          <h2>Statistiques</h2>
          <p>Moyenne générale : <strong>{user?.generalAverage.toFixed(2)}%</strong></p>
        </div>

        <h2>Historique des Quiz</h2>
        <table>
          <thead>
            <tr>
              <th>Nom du Quiz</th>
              <th>Note</th>
              <th>Date</th>
              <th>Moyenne</th>
            </tr>
          </thead>
          <tbody>
            {user?.quizzes.length ? user.quizzes.map((quiz, index) => (
              <QuizHistoryTabComponent key={index} quizIndex={index} quizId={quiz.quizId} score={quiz.score} total={quiz.total} date={quiz.date} />
            )) : <tr><td colSpan={4}>Aucun quiz effectué.</td></tr>}
          </tbody>
        </table>

        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    </div>
  );
};

export default Profile;
