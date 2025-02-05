import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './PlayQuiz.css';
import ResponseFieldComponent from "../../components/ResponseField/ResponseField";
import ButtonComponent from "../../components/Button/Button";
import ThemeCartComponent from "../../components/ThemeCart/ThemeCart";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/AuthContext";


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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);

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

  // --- Sélection d'une réponse ---
  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  // --- Validation de la réponse ---
  const validateAnswer = () => {
    if (selectedAnswer === null) return;
    setValidated(true);

    if (quiz && quiz.questions[currentQuestion].reponse_correcte === selectedAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // --- Passer à la question suivante OU Terminer le quiz ---
  const handleNextQuestion = async () => {

    const userId = user?.id;

    // S'il reste des questions
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setValidated(false);
    } 
    // Sinon, le quiz est terminé
    else {
      try {        

        // On envoie les résultats au back-end
        const response = await fetch("http://localhost:5000/api/quiz/submit-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            quizId: quiz?._id,      
            score: score,
            total: quiz?.questions.length,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi des résultats du quiz");
        }

        // Redirection vers la page de résultats
        navigate(`/resultats?score=${score}&total=${quiz?.questions.length}&quizId=${quiz?._id}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!quiz) return <p>Chargement...</p>;

  return (
    <div className="main">
      <Navbar />
      <div className="GameContainer">
        <ThemeCartComponent name={quiz.title} />

        <span className="currentQuestion">
          Question {currentQuestion + 1} / {quiz.questions.length}
        </span>

        <p>
          {quiz.questions[currentQuestion].question}
        </p>

        <div className="response-container">
          {quiz.questions[currentQuestion].reponses.map((reponse, index) => (
            <ResponseFieldComponent
              key={index}
              response={reponse}
              className={
                validated
                  ? index === quiz.questions[currentQuestion].reponse_correcte
                    ? "right-answer"
                    : selectedAnswer === index
                    ? "wrong-answer"
                    : ""
                  : selectedAnswer === index
                  ? "selected-answer"
                  : ""
              }
              onClick={!validated ? () => handleAnswerSelection(index) : undefined}
            />
          ))}
        </div>

        {/* Bouton Valider si non validé */}
        {!validated && (
          <ButtonComponent
            name="Valider"
            onClick={validateAnswer}
          />
        )}

        {/* Bouton "Suivant" ou "Terminer" si validé */}
        {validated && (
          <ButtonComponent
            name={
              currentQuestion < quiz.questions.length - 1
                ? "Question suivante"
                : "Terminer le Quiz"
            }
            onClick={handleNextQuestion}
          />
        )}
      </div>
    </div>
  );
};

export default PlayQuiz;
