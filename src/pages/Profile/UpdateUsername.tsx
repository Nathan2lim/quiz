import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";

function UpdateUsername() {
  const { user } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Erreur lors de la mise à jour.");
      } else {
        setMessage("Nom d'utilisateur mis à jour avec succès !");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div>
      <h1>Changer mon nom d'utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nouveau nom d'utilisateur</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateUsername;
