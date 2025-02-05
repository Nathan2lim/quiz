import { useState } from "react";

const CreateQuiz = () => {
  const [question, setQuestion] = useState("");
  const [reponse1, setReponse1] = useState("");
  const [reponse2, setReponse2] = useState("");
  const [reponse3, setReponse3] = useState("");
  const [reponse4, setReponse4] = useState("");
  const [reponseCorrecte, setReponseCorrecte] = useState("1");
  const [explication, setExplication] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Authentification si nécessaire
        },
        body: JSON.stringify({
          question,
          reponse1,
          reponse2,
          reponse3,
          reponse4,
          reponse_correcte: reponseCorrecte,
          explication,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création du quiz");
      }

      setMessage("Quiz créé avec succès !");
      setQuestion("");
      setReponse1("");
      setReponse2("");
      setReponse3("");
      setReponse4("");
      setReponseCorrecte("1");
      setExplication("");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Créer un Quiz</h2>
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Réponse 1" value={reponse1} onChange={(e) => setReponse1(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Réponse 2" value={reponse2} onChange={(e) => setReponse2(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Réponse 3" value={reponse3} onChange={(e) => setReponse3(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Réponse 4" value={reponse4} onChange={(e) => setReponse4(e.target.value)} className="w-full p-2 border rounded" />
          <select value={reponseCorrecte} onChange={(e) => setReponseCorrecte(e.target.value)} className="w-full p-2 border rounded">
            <option value="1">Réponse 1</option>
            <option value="2">Réponse 2</option>
            <option value="3">Réponse 3</option>
            <option value="4">Réponse 4</option>
          </select>
          <input type="text" placeholder="Explication" value={explication} onChange={(e) => setExplication(e.target.value)} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Créer</button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
