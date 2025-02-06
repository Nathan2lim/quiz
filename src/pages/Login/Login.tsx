import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ButtonComponent from "../../components/Button/Button";
import InputComponent from "../../components/Input/Input";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [inputErrors, setInputErrors] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setInputErrors({ ...inputErrors, [name]: false });
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    const newInputErrors = { email: false, password: false };

    if (!formData.email) {
      newErrors.push("L'email est requis.");
      newInputErrors.email = true;
    }
    if (!formData.password) {
      newErrors.push("Le mot de passe est requis.");
      newInputErrors.password = true;
    }

    setErrors(newErrors);
    setInputErrors(newInputErrors);
    return newErrors.length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      // Stocker l'utilisateur et le token dans localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Ajout de l'utilisateur

      navigate("/"); // Redirige vers la page d'accueil
      window.location.reload(); // Recharge la page pour mettre à jour le state de l'utilisateur
    } catch (err: any) {
      setErrors([err.message]);
    }
  };

  return (
    <div className="main">
      <Navbar />
      <div className="auth-form">
        <div>
          <h2>Bon retour !</h2>
          <p className="alreadyRegister">Pas encore de compte ?<Link to="/register"> Inscrivez-vous !</Link></p>
        </div>
        <form onSubmit={handleLogin}>
          <InputComponent
            label="Email"
            type="email"
            name="email"
            placeholder="exemple@exemple.com"
            value={formData.email}
            onChange={handleInputChange}
            className={inputErrors.email ? "input-error" : ""}
          />
          <InputComponent
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            className={inputErrors.password ? "input-error" : ""}
          />
          {errors.length > 0 && (
            <div>
              {errors.map((err, index) => (
                <p key={index} className="error-message">{err}</p>
              ))}
            </div>
          )}
          <ButtonComponent name="Connexion" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Login;
