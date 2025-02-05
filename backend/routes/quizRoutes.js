const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const User = require("../models/User");
const Quiz = require("../models/Quiz");

router.post("/", quizController.createQuiz);
router.get("/", quizController.getAllQuizzes); 
router.get("/:id", quizController.getQuizById); 

router.post("/submit-score", async (req, res) => {
    try {
        const { userId, quizId, score, total } = req.body;
  
      // Chercher l'utilisateur par son _id
      console.log("Before findById user...");
      const user = await User.findById(userId);
      console.log("User = ", user);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Checker l'existence du quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz non trouvé." });
      }
  
      // Ajouter et sauvegarder
      user.quizzes.push({ quizId, score, total });
      await user.save();
  
      return res.status(200).json({
        message: "Score enregistré avec succès.",
        user: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Une erreur est survenue lors de l’enregistrement du score.",
        error: error,
      });
    }
  });
  

module.exports = router;
