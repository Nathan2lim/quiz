import './SelectQuiz.css';
interface SelectQuizProps {
    id: string;
    title: string;
    description: string;
    onClick?: () => void;
}
const SelectQuizComponent: React.FC<SelectQuizProps> = ({id, title, description, onClick}) => {
    return (
        <div className='select-quiz' key={id}>
            <h2 className="quiz-title">{title}</h2>
            <p className='quiz-description'>{description}</p>
            <button className='start-quiz-btn' onClick={onClick}>Lancer</button>
        </div>
    )
}

export default SelectQuizComponent;
