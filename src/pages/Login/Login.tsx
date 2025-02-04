import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ButtonComponent from "../../components/Button/Button";
import InputComponent from "../../components/Input/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }
  
      // Stocker l'utilisateur et le token dans localStorage
      localStorage.setItem("token", data.token); 
      localStorage.setItem("user", JSON.stringify(data.user)); // Ajout de l'utilisateur
  
      navigate("/"); // Redirige vers la page d'accueil
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <div className="main">
      <Navbar />
      <div className="auth-form">
        <div>
          <h2>Bon retour !</h2>
          <p className="alreadyRegister">Pas encore de compte ?<Link to="/register"> Connectez-vous !</Link></p>
        </div>
        <form onSubmit={handleLogin}>
          {error && <p>{error}</p>}
          <InputComponent 
            label="Email"
            type="email"
            placeholder="exemple@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputComponent
            label="Mot de passe"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ButtonComponent name="Connexion" type="submit"/>
        </form>
      </div>
    </div>
  );
};

export default Login;
