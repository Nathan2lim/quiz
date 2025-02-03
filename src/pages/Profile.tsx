import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Profil de {user?.username}</h1>
      <p className="text-gray-600">Email : {user?.email}</p>

      <h2 className="text-2xl font-semibold mt-4">Statistiques</h2>
      <p>Moyenne générale : <strong>{user?.generalAverage.toFixed(2)}%</strong></p>

      <h2 className="text-2xl font-semibold mt-4">Historique des Quiz</h2>
      <ul className="mt-2">
        {user?.quizzes.length ? user.quizzes.map((quiz, index) => (
          <li key={index} className="border p-2 rounded-lg shadow-md my-2">
            <p>Quiz ID : {quiz.quizId}</p>
            <p>Note : {quiz.score} / {quiz.total} </p>
            <p>Date : {new Date(quiz.date).toLocaleDateString()}</p>
            <p>Moyenne sur ce quiz : {user.averageScorePerQuiz[quiz.quizId]?.toFixed(2)}%</p>
          </li>
        )) : <p>Aucun quiz effectué.</p>}
      </ul>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
};

export default Profile;
