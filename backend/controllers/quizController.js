const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// ---------------------------
// Créer un quiz avec plusieurs questions
// ---------------------------
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Le titre et la description sont obligatoires" });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Le quiz doit contenir au moins une question" });
    }

    // Transformer et créer les questions
    // Pour chaque question, on transforme "answers" en "reponses" (tableau de string)
    // et on détermine l'indice de la bonne réponse (reponse_correcte).
    const transformedQuestions = questions.map(q => {
      // Extraire le tableau de textes
      const reponses = q.answers.map(answer => answer.text);

      // Trouver l'index de la bonne réponse
      const indexCorrect = q.answers.findIndex(answer => answer.isCorrect === true);
      if (indexCorrect === -1) {
        throw new Error(`Aucune bonne réponse définie pour la question: "${q.question}"`);
      }

      return {
        question: q.question,
        reponses,
        reponse_correcte: indexCorrect, // Note : 0, 1, 2 ou 3
        explication: q.explanation || ""
      };
    });

    // Créer les documents Question en base
    const createdQuestions = await Question.insertMany(transformedQuestions);
    const questionIds = createdQuestions.map(q => q._id);

    // Créer le quiz en référence aux questions créées
    const newQuiz = new Quiz({
      title,
      description,
      questions: questionIds
    });

    await newQuiz.save();

    return res.status(201).json({ message: "Quiz créé avec succès", quiz: newQuiz });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la création du quiz", error: error.message });
  }
};
// ---------------------------
// Récupérer tous les quiz avec leurs questions
// ---------------------------
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ deletedAt: null }).populate("questions");
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
  
exports.deleteQuiz = async (req, res) => {
  console.log("deleteQuiz");
  try {
    const { id } = req.params;

    // Vérifier si le quiz existe
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    // Supprimer le quiz de la base de données
    await Quiz.findByIdAndUpdate(id, { deletedAt: new Date() });

    return res.status(200).json({ message: "Quiz supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la suppression du quiz" });
  }
};
  