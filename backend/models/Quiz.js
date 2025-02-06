const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // Stocke les questions liées
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Quiz", quizSchema);