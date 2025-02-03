const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// ---------------------------
// Créer un quiz avec plusieurs questions
// ---------------------------
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Le titre et les questions sont obligatoires" });
    }

    // Vérifier si toutes les questions existent
    const existingQuestions = await Question.find({ _id: { $in: questions } });

    if (existingQuestions.length !== questions.length) {
      return res.status(400).json({ message: "Certaines questions sont introuvables" });
    }

    // Création du quiz
    const newQuiz = new Quiz({
      title,
      description,
      questions,
    });

    await newQuiz.save();
    return res.status(201).json({ message: "Quiz créé avec succès", quiz: newQuiz });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la création du quiz" });
  }
};

// ---------------------------
// Récupérer tous les quiz avec leurs questions
// ---------------------------
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions"); // Récupère les questions liées
    return res.json(quizzes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getQuizById = async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id).populate("questions");
      if (!quiz) return res.status(404).json({ message: "Quiz introuvable" });
  
      res.json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  