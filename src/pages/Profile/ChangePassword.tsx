import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";

function ChangePassword() {
  const { user } = useAuth(); // pour récupérer l'ID utilisateur
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          password: newPassword, // le backend attend "password" pour la mise à jour
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Erreur lors de la mise à jour du mot de passe.");
      } else {
        setMessage("Mot de passe mis à jour avec succès !");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div>
      <h1>Changer mon mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ancien mot de passe</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
