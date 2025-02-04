import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import './Timer.css';

interface TimerProps {
    duration?: number;
    onTimeUp?: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration = 15, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState<number>(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp && onTimeUp();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = (timeLeft / duration) * circumference;

    return (
        <div className="timer">
            <svg width="100" height="100" viewBox="0 0 100 100">
                {/* Fond du cercle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#DCC3FF"
                    strokeWidth="10"
                    fill="none"
                    />
                    {/* Partie animée du timer */}
                    <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#8E3DFF"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </svg>
            {/* Texte du compteur */}
            <span
                style={{ position: "absolute", fontSize: "20px", fontWeight: "bold" }}>
                {timeLeft}s
            </span>
        </div>
    );
};

export default Timer;
