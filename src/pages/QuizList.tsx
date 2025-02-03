import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: string[]; // IDs des questions
}

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quiz");
        if (!response.ok) throw new Error("Erreur lors de la récupération des quiz");
        const data = await response.json();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`); // Redirige vers la page du quiz
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Quiz</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4">
        {quizzes.length === 0 && !loading && <p>Aucun quiz disponible.</p>}
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="border-b py-4">
            <h2 className="text-lg font-semibold">{quiz.title}</h2>
            <p className="text-gray-500 text-sm">{quiz.description}</p>
            <button
              onClick={() => handleStartQuiz(quiz._id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Lancer le Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
