import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import SelectQuizComponent from '../../components/SelectQuiz/SelectQuiz';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from "../../utils/AuthContext";


interface Quiz {
    _id: string;
    title: string;
    description: string;
    questions: string[]; // IDs des questions
}
interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}
const Home = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // ✅ Correction ici
    const navigate = useNavigate();
    const { user} = useAuth();

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

    const handleDeleteQuiz = async (quizId: string) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:5000/api/quiz/${quizId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la suppression du quiz");
            }

            setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
            setMessage("Quiz supprimé avec succès !"); 
        } catch (err: any) {
            setMessage(err.message);
        }
    };

    return (
        <div className='main'>
            <Navbar />
            <div className='home__container'>
                <h2>Choississez votre quiz !</h2>
                {loading && <p>Chargement...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}

                <div className='quizzes'>
                    {quizzes.length === 0 && !loading && <p>Aucun quiz disponible.</p>}
                    {quizzes.map((quiz) => (
                        <SelectQuizComponent key={quiz._id} id={quiz._id} title={quiz.title} description={quiz.description} onStart={() => handleStartQuiz(quiz._id)}
                        onDelete={() => handleDeleteQuiz(quiz._id)} user={user} />
                    ))}

                    
                </div>
            </div>
        </div>
    );
};

export default Home;