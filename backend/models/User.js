const mongoose = require('mongoose');
const { rollupVersion } = require('vite');

const userSchema = new mongoose.Schema({  
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizzes: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // Référence au quiz
      score: { type: Number, required: true }, // Note obtenue
      total: { type: Number, required: true }, // Score maximum
      date: { type: Date, default: Date.now } // Date du quiz
    }
  ],
  averageScorePerQuiz: {
    type: Map,
    of: Number, // Stocke la moyenne par quiz
    default: {},
  },
  generalAverage: {
    type: Number, // Moyenne générale de tous les quiz
    default: 0,
  },

  role: { type: String, default: 'user' } // Rôle de l'utilisateur
});

// Calcul automatique des moyennes avant de sauvegarder
userSchema.pre('save', function (next) {
  if (this.quizzes.length > 0) {
    let totalScore = 0;
    let totalMax = 0;
    const scoresByQuiz = {};

    this.quizzes.forEach(({ quizId, score, total }) => {
      totalScore += score;
      totalMax += total;
      
      if (!scoresByQuiz[quizId]) {
        scoresByQuiz[quizId] = { sum: 0, count: 0 };
      }
      scoresByQuiz[quizId].sum += score;
      scoresByQuiz[quizId].count += 1;
    });

    // Calcul des moyennes par quiz
    Object.keys(scoresByQuiz).forEach((quizId) => {
      this.averageScorePerQuiz.set(
        quizId,
        scoresByQuiz[quizId].sum / scoresByQuiz[quizId].count
      );
    });

    // Calcul de la moyenne générale
    this.generalAverage = totalScore / totalMax * 100;
  }
  next();
});

// Export du modèle User
module.exports = mongoose.model('User', userSchema);
