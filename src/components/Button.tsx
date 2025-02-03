import './Button.css';

interface ButtonComponentProps {
    name: string;
    onClick?: () => void | Promise<void>;
}

const ButtonComponent = ({ name, onClick }: ButtonComponentProps) => {
    return <button className="mainButton" onClick={onClick}>{name}</button>;
};

export default ButtonComponent;