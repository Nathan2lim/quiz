import './ResponseField.css';

const ResponseFieldComponent = ({ response }: { response: string }) => {
    return (
        <div className="responseField">
            <div className="selection"></div>
            <label htmlFor="response1">
                {response}
                <input type="radio" id="response1"></input>
                <span className="radio-custom"></span>
            </label>
        </div>
    );
};

export default ResponseFieldComponent;