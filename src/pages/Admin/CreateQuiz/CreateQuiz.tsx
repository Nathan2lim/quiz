import React, { useState } from "react";

interface QuestionForm {
  question: string;
  reponse1: string;
  reponse2: string;
  reponse3: string;
  reponse4: string;
  reponseCorrecte: string; // "1" | "2" | "3" | "4"
  explication: string;
}

const CreateQuiz = () => {
  // Champs pour le quiz
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Tableau dynamique de questions
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      question: "",
      reponse1: "",
      reponse2: "",
      reponse3: "",
      reponse4: "",
      reponseCorrecte: "1",
      explication: "",
    },
  ]);

  const [message, setMessage] = useState("");

  // Ajouter une question vide
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        reponse1: "",
        reponse2: "",
        reponse3: "",
        reponse4: "",
        reponseCorrecte: "1",
        explication: "",
      },
    ]);
  };

  // Supprimer une question à l’index donné
  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Mettre à jour un champ dans une question précise
  const handleQuestionChange = (
    index: number,
    field: keyof QuestionForm,
    value: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const token = localStorage.getItem("token");
  
      // Adapter le format des questions pour correspondre au backend
      const body = {
        title,
        description,
        questions: questions.map((q) => ({
          question: q.question,
          reponses: [q.reponse1, q.reponse2, q.reponse3, q.reponse4], // Tableau des réponses
          reponse_correcte: parseInt(q.reponseCorrecte, 10) - 1, // Convertit "1" | "2" | "3" | "4" en index 0, 1, 2, 3
          explication: q.explication,
        })),
      };
  
      const response = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Si la route est protégée
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création du quiz");
      }
  
      setMessage("Quiz créé avec succès !");
      // Réinitialiser le formulaire
      setTitle("");
      setDescription("");
      setQuestions([
        {
          question: "",
          reponse1: "",
          reponse2: "",
          reponse3: "",
          reponse4: "",
          reponseCorrecte: "1",
          explication: "",
        },
      ]);
    } catch (err: any) {
      setMessage(err.message);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-4">Créer un Quiz</h2>
        
        {message && (
          <p className="text-green-500 text-sm text-center mb-2">{message}</p>
        )}

        <form onSubmit={handleCreateQuiz} className="space-y-4">
          {/* Titre du quiz */}
          <input
            type="text"
            placeholder="Titre du Quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Description du quiz */}
          <textarea
            placeholder="Description du Quiz"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />

          <hr />

          {/* Section QUESTIONS */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Questions</h3>
            {questions.map((q, index) => (
              <div
                key={index}
                className="border p-4 mb-4 rounded bg-gray-50 relative"
              >
                {/* Bouton pour supprimer la question si on a plus d'une question */}
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="absolute right-2 top-2 text-red-500 text-sm"
                  >
                    Supprimer
                  </button>
                )}

                {/* Intitulé de la question */}
                <label className="block mb-2 font-semibold">
                  Question #{index + 1}
                </label>
                <input
                  type="text"
                  placeholder="Intitulé de la question"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                  required
                />

                {/* Réponse 1 */}
                <input
                  type="text"
                  placeholder="Réponse 1"
                  value={q.reponse1}
                  onChange={(e) =>
                    handleQuestionChange(index, "reponse1", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                  required
                />

                {/* Réponse 2 */}
                <input
                  type="text"
                  placeholder="Réponse 2"
                  value={q.reponse2}
                  onChange={(e) =>
                    handleQuestionChange(index, "reponse2", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                  required
                />

                {/* Réponse 3 */}
                <input
                  type="text"
                  placeholder="Réponse 3"
                  value={q.reponse3}
                  onChange={(e) =>
                    handleQuestionChange(index, "reponse3", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                />

                {/* Réponse 4 */}
                <input
                  type="text"
                  placeholder="Réponse 4"
                  value={q.reponse4}
                  onChange={(e) =>
                    handleQuestionChange(index, "reponse4", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                />

                {/* Sélection de la bonne réponse */}
                <label className="block font-semibold">Réponse correcte :</label>
                <select
                  value={q.reponseCorrecte}
                  onChange={(e) =>
                    handleQuestionChange(index, "reponseCorrecte", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="1">Réponse 1</option>
                  <option value="2">Réponse 2</option>
                  <option value="3">Réponse 3</option>
                  <option value="4">Réponse 4</option>
                </select>

                {/* Explication */}
                <input
                  type="text"
                  placeholder="Explication"
                  value={q.explication}
                  onChange={(e) =>
                    handleQuestionChange(index, "explication", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
            ))}

            {/* Bouton pour ajouter une question */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              + Ajouter une question
            </button>
          </div>

          <hr />

          {/* Bouton final de création */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Créer le Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
