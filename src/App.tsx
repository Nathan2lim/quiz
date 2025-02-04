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

import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CreateQuiz />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-list"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <PlayQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;