import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  _id: string;
  question: string;
  reponses: string[];
  reponse_correcte: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

const PlayQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération du quiz");
        const data = await response.json();
        setQuiz(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (quiz && quiz.questions[currentQuestion].reponse_correcte === index) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      alert(`Quiz terminé ! Score : ${score}/${quiz?.questions.length}`);
      navigate("/quiz-list");
    }
  };

  if (!quiz) return <p>Chargement...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-600">{quiz.description}</p>

      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-lg font-semibold">
          Question {currentQuestion + 1} / {quiz.questions.length}
        </h2>
        <p className="text-gray-800 mt-2">{quiz.questions[currentQuestion].question}</p>

        <div className="mt-4">
          {quiz.questions[currentQuestion].reponses.map((reponse, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-2 rounded border mt-2 ${
                selectedAnswer === index
                  ? index === quiz.questions[currentQuestion].reponse_correcte
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              disabled={showAnswer}
            >
              {reponse}
            </button>
          ))}
        </div>

        {showAnswer && (
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentQuestion < quiz.questions.length - 1 ? "Question suivante" : "Terminer le Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayQuiz;
