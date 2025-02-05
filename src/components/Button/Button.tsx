import './Button.css';

interface ButtonComponentProps {
    name: string;
    onClick?: () => void | Promise<void>;
    type?: "button" | "submit";
}

const ButtonComponent = ({ name, onClick, type }: ButtonComponentProps) => {
    return <button type={type} className="mainButton" onClick={onClick}>{name}</button>;
};

export default ButtonComponent;