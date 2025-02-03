import './Game.css';
import { useEffect, useState } from 'react';
import ResponseFieldComponent from '../components/ResponseField';
import TimerComponent from '../components/Timer';
import ButtonComponent from '../components/Button';
const Game = () => {

    const [apiResponse, setApiResponse] = useState<[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/quiz');
                const data = await res.json();
                console.log(data);
                setApiResponse(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="GamePage">
            <div className="GameContainer">
                <p>Question Number</p>
                <TimerComponent />
                <p>Question</p>
                <div className="response-container">
                    <ResponseFieldComponent response='Réponse 1'/>
                    <ResponseFieldComponent response='Réponse 2'/>
                    <ResponseFieldComponent response='Réponse 3'/>
                    <ResponseFieldComponent response='Réponse 4'/>
                </div>
                <ButtonComponent name="Valider" />

            </div>
        </div>
    );
};

export default Game;