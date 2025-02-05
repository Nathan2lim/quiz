import './Input.css';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const InputComponent: React.FC<InputProps> = ({label, placeholder, type, name, value, onChange, className}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input name={name} type={type} className={`input ${className}`} placeholder={placeholder} value={value} onChange={onChange}/>
        </div>
    );
}

export default InputComponent;