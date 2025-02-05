import { useEffect, useState } from 'react';
import './QuizHistoryTab.css';

interface QuizHistoryTabProps {
    quizIndex: number;
    quizId: string;
    score: number;
    total: number;
    date: string;
}

interface Quiz {
    _id: string;
    title: string;
    description: string;
}

const QuizHistoryTabComponent: React.FC<QuizHistoryTabProps> = ({ quizIndex, quizId, score, total, date }) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);

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

        fetchQuiz();
    }, [quizId]);

    return (
        <tr key={quizId}>
            <td>{quiz?.title}</td>
            <td>{score} / {total}</td>
            <td>{new Date(date).toLocaleDateString()}</td>
            <td>{((score / total) * 100).toFixed(2)}%</td>
        </tr>
    );
};

export default QuizHistoryTabComponent;