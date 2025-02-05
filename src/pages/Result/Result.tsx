import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import './Result.css';
import { useEffect, useState } from "react";
import ThemeCartComponent from "../../components/ThemeCart/ThemeCart";
import confettiImg from '../../assets/confetti.png';
import ButtonComponent from "../../components/Button/Button";

interface Quiz {
  _id: string;
  title: string;
  description: string;
}

function Resultats() {
  const location = useLocation();
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  
  // On récupère la query string, par exemple : ?score=5&total=10
  const searchParams = new URLSearchParams(location.search);
  const score = searchParams.get("score");
  const total = searchParams.get("total");
  const quizId = searchParams.get("quizId");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/${quizId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération du quiz");
        const data = await response.json();
        setQuiz(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleNewThemeClick = () => {
    navigate('/');
  }

  return (
    <div className="main">
      <Navbar />
      <div className="result-container">
        <div>
          <ThemeCartComponent name={quiz?.title ?? "Thème joué"} />
          <h2>Bien joué ! <img src={confettiImg}></img></h2>
        </div>
        <span className="score">Score : {score} / {total}</span>

        <ButtonComponent name="Nouveau Thème" onClick={handleNewThemeClick}/>
      </div>
    </div>
  );
}

export default Resultats;
