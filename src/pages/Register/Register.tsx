import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import InputComponent from "../../components/Input/Input";
import ButtonComponent from "../../components/Button/Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      localStorage.setItem("token", data.token);
      navigate("/"); // Redirige vers la page d'accueil après inscription
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="main">
      <Navbar />
      <div className="auth-form">
        <div>
          <h2>Inscription</h2>
          <p>Déjà un compte ? <Link to="/login">Connectez-vous !</Link></p>
        </div>
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}
          <InputComponent
            label="Nom d'utilisateur"
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <ButtonComponent type="submit" name="Inscription" />
        </form>
      </div>
    </div>
  );
};

export default Register;
