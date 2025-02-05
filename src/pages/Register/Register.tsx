import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import InputComponent from "../../components/Input/Input";
import ButtonComponent from "../../components/Button/Button";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [inputErrors, setInputErrors] = useState({ username: false, email: false, password: false });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setInputErrors({ ...inputErrors, [name]: false });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8 || password.length > 26) {
      setPasswordError("Le mot de passe doit contenir entre 8 et 26 caractères.");
      setInputErrors((prev) => ({ ...prev, password: true }));
    } else {
      setPasswordError(null);
      setInputErrors((prev) => ({ ...prev, password: false }));
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    const newInputErrors = { username: false, email: false, password: false };

    if (!formData.username) {
      newErrors.push("Le nom d'utilisateur est requis.");
      newInputErrors.username = true;
    }
    if (!formData.email) {
      newErrors.push("L'email est requis.");
      newInputErrors.email = true;
    }
    if (!formData.password) {
      newErrors.push("Le mot de passe est requis.");
      newInputErrors.password = true;
    } else if (formData.password.length < 8 || formData.password.length > 26) {
      newErrors.push("Le mot de passe doit contenir entre 8 et 26 caractères.");
      newInputErrors.password = true;
    }

    setErrors(newErrors);
    setInputErrors(newInputErrors);
    return newErrors.length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err: any) {
      setErrors([err.message]);
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
          <InputComponent
            label="Nom d'utilisateur"
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleInputChange}
            className={inputErrors.username ? "input-error" : ""}
          />
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
          <div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            {errors.length > 0 && (
              <div>
                {errors.map((err, index) => (
                  <p key={index} className="error-message">{err}</p>
                ))}
              </div>
            )}
          </div>

          <ButtonComponent type="submit" name="Inscription" />
        </form>
      </div>
    </div>
  );
};

export default Register;