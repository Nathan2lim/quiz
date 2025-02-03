import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import CreateQuiz from "./pages/CreateQuiz";
import QuizList from "./pages/QuizList";
import UserList from "./pages/UserList";
import PlayQuiz from "./pages/PlayQuiz";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
      <Route path="/quiz-list" element={<QuizList />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/quiz/:id" element={<PlayQuiz />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    
  );
}

export default App
