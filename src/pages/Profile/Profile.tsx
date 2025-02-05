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
            <InputComponent label="Nom d'utilisateur" name="username" type="text" value={user?.username} />
            <button>Mettre à jour</button>
          </div>
          <div className="AccountSectionInputs">
            <InputComponent label="Email" name="email" type="email" value={user?.email} />
            <button>Mettre à jour</button>
          </div>

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
