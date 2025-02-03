import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../components/Button';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className='home'>
        <h1>Quiz Game</h1>
        <p>Bienvenue ! Cliquez sur le button pour jouer !</p>
        <ButtonComponent name="Jouer" onClick={() => navigate('game')}/>
        </div>
    );
};

export default Home;