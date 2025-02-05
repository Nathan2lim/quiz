import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4">
        {users.length === 0 && !loading && <p>Aucun utilisateur trouvé.</p>}
        {users.map((user) => (
          <div key={user._id} className="border-b py-4">
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-600">Email : {user.email}</p>
            <p className="text-sm text-gray-500">Créé le : {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
