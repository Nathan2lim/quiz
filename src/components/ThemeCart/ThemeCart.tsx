import './ThemeCart.css';

interface ThemeCartProps {
    name: string;
}

const ThemeCartComponent = ({ name }: ThemeCartProps) => {
    return (
        <div className="themeCart">
            <p>{name}</p>
        </div>
    );
};

export default ThemeCartComponent;