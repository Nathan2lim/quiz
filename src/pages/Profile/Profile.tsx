import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
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
        <p>Email : {user?.email}</p>

        <h2>Statistiques</h2>
        <p>Moyenne générale : <strong>{user?.generalAverage.toFixed(2)}%</strong></p>

        <h2>Historique des Quiz</h2>
        <ul>
          {user?.quizzes.length ? user.quizzes.map((quiz, index) => (
            <li key={index}>
              <p>Quiz ID : {quiz.quizId}</p>
              <p>Note : {quiz.score} / {quiz.total} </p>
              <p>Date : {new Date(quiz.date).toLocaleDateString()}</p>
              <p>Moyenne sur ce quiz : {user.averageScorePerQuiz[quiz.quizId]?.toFixed(2)}%</p>
            </li>
          )) : <p>Aucun quiz effectué.</p>}
        </ul>

        <button
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Profile;
