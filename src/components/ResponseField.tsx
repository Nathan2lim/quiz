import './ResponseField.css';
interface ResponseFieldProps {
    response: string;
    className?: string;
    onClick?: () => void;
}
const ResponseFieldComponent: React.FC<ResponseFieldProps> = ({ response, className, onClick }) => {    return (
        <div className={`responseField ${className}`} onClick={onClick}>
            <div className="selection"></div>
            <span>{response}</span>
        </div>
    );
};

export default ResponseFieldComponent;