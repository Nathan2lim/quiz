import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './PlayQuiz.css';
import ResponseFieldComponent from "../components/ResponseField";

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
  const [validated, setValidated] = useState(false);
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

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  const validateAnswer = () => {
    if (selectedAnswer === null) return;
    setValidated(true);
    if (quiz && quiz.questions[currentQuestion].reponse_correcte === selectedAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setValidated(false);
    } else {
      alert(`Quiz terminé ! Score : ${score}/${quiz?.questions.length}`);
      navigate("/quiz-list");
    }
  };

  if (!quiz) return <p>Chargement...</p>;

  return (
    <div className="GamePage">
      <div className="GameContainer">
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>

        <span className="text-lg font-semibold">
          Question {currentQuestion + 1} / {quiz.questions.length}
        </span>
        <p className="text-gray-800 mt-2">{quiz.questions[currentQuestion].question}</p>

        <div className="response-container">
          {quiz.questions[currentQuestion].reponses.map((reponse, index) => (
            <ResponseFieldComponent 
              key={index}
              response={reponse}
              className={
                selectedAnswer === index
                  ? validated
                    ? index === quiz.questions[currentQuestion].reponse_correcte
                      ? "right-answer"
                      : "wrong-answer"
                    : "selected-answer"
                  : ""
              }
              onClick={() => handleAnswerSelection(index)}
            />
          ))}
        </div>

        {!validated && (
          <button
            onClick={validateAnswer}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Valider la réponse
          </button>
        )}

        {validated && (
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