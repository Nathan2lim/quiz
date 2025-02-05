import './Input.css';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
}

const InputComponent: React.FC<InputProps> = ({label, placeholder, type, name, value, onChange, className, required}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input name={name} type={type} className={`input ${className}`} placeholder={placeholder} value={value} onChange={onChange} required={required}/>
        </div>
    );
}

export default InputComponent;