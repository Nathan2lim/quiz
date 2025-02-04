import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register"; 
import CreateQuiz from "./pages/Admin/CreateQuiz/CreateQuiz";
import UserList from "./pages/Admin/UserList/UserList";
import PlayQuiz from "./pages/PlayQuiz/PlayQuiz";
import Profile from "./pages/Profile/Profile";

import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/adminRoute";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
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