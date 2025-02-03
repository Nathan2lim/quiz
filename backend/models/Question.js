const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  reponses: [{ type: String, required: true }], // Stocke les réponses sous forme de tableau
  reponse_correcte: { type: Number, required: true }, // Index de la bonne réponse (0, 1, 2, 3)
  explication: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
