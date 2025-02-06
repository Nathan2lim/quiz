const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.post("/", questionController.createQuestion); // Ajouter une question
router.get("/", questionController.getAllQuestions); // Récupérer toutes les questions
router.get("/:id", questionController.getQuestionById); // Récupérer une question par ID
router.put("/:id", questionController.updateQuestion); // Modifier une question
router.delete("/:id", questionController.deleteQuestion); // Supprimer une question
module.exports = router;
