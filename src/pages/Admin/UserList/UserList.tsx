import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import './UserList.css';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  role: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="main">
      <Navbar />
      <div className="user-list-container">
        <h2 className="">Liste des Utilisateurs</h2>
        {loading && <p>Chargement...</p>}
        {error && <p>{error}</p>}
        
        <div>
          {users.length === 0 && !loading && <p>Aucun utilisateur trouvé.</p>}
          {users.length > 0 && (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Email</th>
                  <th>Date de création</th>
                  <th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
