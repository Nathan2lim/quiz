import './Input.css';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent: React.FC<InputProps> = ({label, placeholder, type, value, onChange}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} className="input" placeholder={placeholder} value={value} onChange={onChange} required/>
        </div>
    );
}

export default InputComponent;