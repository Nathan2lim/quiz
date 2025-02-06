import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal"; // Import the Modal component
import './UserList.css';
import deleteImg from '../../../assets/delete.png';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", description: "", username: "", userId: "", className: "" });

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

  const handleActionClick = (title: string, description: string, username: string, userId: string, className: string) => {
    setModalData({ title, description, username, userId, className });
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      let url = "";
      if (modalData.className === "modal-delete") {
        url = `http://localhost:5000/api/auth/${modalData.userId}`;
      } else if (modalData.className === "modal-promote") {
        url = `http://localhost:5000/api/auth/promote/${modalData.userId}`;
      }
      const response = await fetch(url, {
        method: "DELETE", // Change method based on action
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) throw new Error("Erreur lors de l'exécution de l'action");
      setUsers(users.filter(user => user._id !== modalData.userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setModalVisible(false);
    }
  };

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.role}</td>
                    <td className="actions">
                      <button className="delete-btn" onClick={() => handleActionClick("Confirmer la suppression", "Êtes-vous sûr de vouloir supprimer cet utilisateur ?", user.username, user._id, "modal-delete")}><img src={deleteImg}></img></button>
                      {user.role !== "admin" && <button className="admin-btn" onClick={() => handleActionClick("Confirmer la promotion", "Êtes-vous sûr de vouloir promouvoir cet utilisateur en tant qu'administrateur ?", user.username, user._id, "modal-promote")}>Promouvoir</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modalVisible && <Modal {...modalData} onClose={() => setModalVisible(false)} onConfirm={handleConfirm} />}
    </div>
  );
};

export default UserList;
