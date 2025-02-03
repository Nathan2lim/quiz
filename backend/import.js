const mongoose = require("mongoose");
const fs = require("fs");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");
require("dotenv").config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

const importData = async () => {
  try {
    // Lire le fichier JSON
    const data = JSON.parse(fs.readFileSync("quiz_data.json", "utf-8"));

    for (const quizData of data) {
      const questionIds = [];

      for (const q of quizData.questions) {
        const question = new Question(q);
        await question.save();
        questionIds.push(question._id);
      }

      const quiz = new Quiz({
        title: quizData.title,
        description: quizData.description,
        questions: questionIds,
      });

      await quiz.save();
    }

    console.log("✅ Données importées avec succès !");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur lors de l'importation :", error);
    mongoose.connection.close();
  }
};

// Lancer l'importation
importData();
