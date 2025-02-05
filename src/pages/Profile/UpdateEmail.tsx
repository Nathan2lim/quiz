import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";

function UpdateEmail() {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Erreur lors de la mise à jour.");
      } else {
        setMessage("Email mis à jour avec succès !");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div>
      <h1>Modifier mon email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nouvel email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateEmail;
