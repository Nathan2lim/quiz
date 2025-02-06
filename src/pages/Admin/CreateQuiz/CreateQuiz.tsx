import React, { useState } from "react";
import './CreateQuiz.css';
import Navbar from "../../../components/Navbar/Navbar";
import InputComponent from "../../../components/Input/Input";
import ButtonComponent from "../../../components/Button/Button";

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
    <div className="main">
      <Navbar />
      <div className="CreateQuizContainer">
        <h2 className="">Créer un Quiz</h2>
        
        {message && (
          <p className="">{message}</p>
        )}

        <form onSubmit={handleCreateQuiz} className="create-quiz-form">
        <h3>Informations générales</h3>
          <div className="form-row general-info">
            <InputComponent
              label="Titre du Quiz"
              type="text"
              placeholder="Titre du Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={true}
            />

            <div className="textarea-container">
              <label>Description</label>
              <textarea
                placeholder="Description du Quiz"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

          </div>

          {/* Section QUESTIONS */}
          <div>
            <h3 className="question-title">Questions</h3>
            <div className="questions-container">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="question-container"
                >
                  <div className="header-container">
                    {/* Intitulé de la question */}
                    <label className="question-label">
                      Question #{index + 1}
                    </label>
                    {/* Bouton pour supprimer la question si on a plus d'une question */}
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="delete-btn"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  <InputComponent
                    label="Intitulé de la question"
                    type="text"
                    placeholder="Intitulé de la question"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    required={true}
                  />
                  <div className="form-row-grid">
                    <InputComponent
                      label="Réponse 1"
                      type="text"
                      placeholder="Réponse 1"
                      value={q.reponse1}
                      onChange={(e) =>
                        handleQuestionChange(index, "reponse1", e.target.value)
                      }
                      required={true}
                    />

                    <InputComponent
                      label="Réponse 2"
                      type="text"
                      placeholder="Réponse 2"
                      value={q.reponse2}
                      onChange={(e) =>
                        handleQuestionChange(index, "reponse2", e.target.value)
                      }
                      required={true}
                    />

                    <InputComponent
                      label="Réponse 3"
                      type="text"
                      placeholder="Réponse 3"
                      value={q.reponse3}
                      onChange={(e) =>
                        handleQuestionChange(index, "reponse3", e.target.value)
                      }
                    />

                    <InputComponent
                      label="Réponse 4"
                      type="text"
                      placeholder="Réponse 4"
                      value={q.reponse4}
                      onChange={(e) =>
                        handleQuestionChange(index, "reponse4", e.target.value)
                      }
                    />
                  </div>

                  {/* Sélection de la bonne réponse */}
                  <div className="form-row">
                    <div className="select-container">
                      <label>Réponse correcte :</label>
                      <select
                        value={q.reponseCorrecte}
                        onChange={(e) =>
                          handleQuestionChange(index, "reponseCorrecte", e.target.value)
                        }
                      >
                        <option value="1">Réponse 1</option>
                        <option value="2">Réponse 2</option>
                        <option value="3">Réponse 3</option>
                        <option value="4">Réponse 4</option>
                      </select>
                    </div>

                    {/* Explication */}
                    <InputComponent
                      label="Explication"
                      type="text"
                      placeholder="Explication"
                      value={q.explication}
                      onChange={(e) =>
                        handleQuestionChange(index, "explication", e.target.value)
                      }
                      required={true}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddQuestion}
                className="add-question-btn"
              >
                + Ajouter une question
              </button>
            </div>
          </div>
          <ButtonComponent
            type="submit"
            name="Créer le Quiz"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
