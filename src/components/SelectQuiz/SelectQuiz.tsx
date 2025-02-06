import './SelectQuiz.css';
import deleteImg from '../../assets/delete.png';

interface SelectQuizProps {
    id: string;
    title: string;
    description: string;
    onStart: () => void;
    onDelete: () => void;
    user?: User | null;
}

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}
const SelectQuizComponent: React.FC<SelectQuizProps> = ({id, title, description,onStart, onDelete, user  }) => {
    return (
        <div className='select-quiz' key={id}>
            <h2 className="quiz-title">{title}</h2>
            <p className='quiz-description'>{description}</p>
            {/* <button className='start-quiz-btn' onClick={onClick}>Lancer</button> */}
            <div className="buttons">
                                {user?.role === "admin" && (
                                    <button 
                                        onClick={onDelete} 
                                        className="delete-quiz-btn"
                                    >
                                        <img src={deleteImg} alt="delete" />
                                    </button>
                                )}
                                <button 
                                    onClick={onStart} 
                                    className="start-quiz-btn"
                                >
                                    Lancer
                                </button>
                            </div>

        </div>
    )
}

export default SelectQuizComponent;
