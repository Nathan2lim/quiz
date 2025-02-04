const Question = require("../models/Question");

// ---------------------------
// 🔹 Créer une question
// ---------------------------
const createQuestion = async (req, res) => {
  try {
    const { question, reponses, reponse_correcte, explication } = req.body;

    if (!question || !reponses || reponses.length < 2 || reponse_correcte === undefined) {
      return res.status(400).json({ message: "Tous les champs sont requis (question, réponses, réponse correcte)" });
    }

    // Création de la question
    const newQuestion = new Question({
      question,
      reponses,
      reponse_correcte,
      explication,
    });

    await newQuestion.save();
    return res.status(201).json({ message: "Question créée avec succès", question: newQuestion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la création de la question" });
  }
};

// ---------------------------
// 🔹 Récupérer toutes les questions
// ---------------------------
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    return res.json(questions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------------------------
// 🔹 Récupérer une question par ID
// ---------------------------
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question introuvable" });
    }
    return res.json(question);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------------------------
// 🔹 Mettre à jour une question
// ---------------------------
const updateQuestion = async (req, res) => {
  try {
    const { question, reponses, reponse_correcte, explication } = req.body;

    // Mise à jour de la question
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { question, reponses, reponse_correcte, explication },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question introuvable" });
    }

    return res.json({ message: "Question mise à jour avec succès", question: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------------------------
// 🔹 Supprimer une question
// ---------------------------
const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Question introuvable" });
    }
    return res.json({ message: "Question supprimée avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Exporter toutes les fonctions
module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
};
