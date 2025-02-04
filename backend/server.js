
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes'); 
const questionRoutes = require('./routes/questionRoutes'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes); // <-- usage
app.use("/api/questions", questionRoutes);


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

//|id_|titre|question|reponse1|reponse2|reponse3|reponse4|reponse_correcte|explication|
