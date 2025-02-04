import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import SelectQuizComponent from '../../components/SelectQuiz/SelectQuiz';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';

interface Quiz {
    _id: string;
    title: string;
    description: string;
    questions: string[]; // IDs des questions
}

const Home = () => {
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
        <div className='main'>
            <Navbar />
            <div className='home__container'>
                <h2>Choississez votre quiz !</h2>
                {loading && <p>Chargement...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className='quizzes'>
                    {quizzes.length === 0 && !loading && <p>Aucun quiz disponible.</p>}
                    {quizzes.map((quiz) => (
                        <SelectQuizComponent key={quiz._id} id={quiz._id} title={quiz.title} description={quiz.description} onClick={() => handleStartQuiz(quiz._id)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;