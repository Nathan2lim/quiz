import './ResponseField.css';

const ResponseFieldComponent = ({ response }: { response: string }) => {
    return (
        <div className="responseField">
            <div className="selection"></div>
            <span>{response}</span>
        </div>
    );
};

export default ResponseFieldComponent;