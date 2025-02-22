const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** ========================
 *  AUTHENTIFICATION (REGISTER, LOGIN)
 *  ======================== **/

// INSCRIPTION (REGISTER)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// CONNEXION (LOGIN)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token valide 1 jour
    });

    return res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ROUTE PROTÉGÉE
exports.protectedRoute = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.json({
      message: 'Accès autorisé',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

/** ========================
 *  CRUD UTILISATEURS
 *  ======================== **/

// CRÉER UN UTILISATEUR (ADMIN)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer et sauvegarder l'utilisateur
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès !',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
  }
};

// OBTENIR TOUS LES UTILISATEURS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclure les mots de passe
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

// OBTENIR UN UTILISATEUR PAR ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
  }
};

// METTRE À JOUR UN UTILISATEUR
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.username = username ?? user.username;
    user.email    = email ?? user.email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès !',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

// SUPPRIMER UN UTILISATEUR
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};


const addQuizResult = async (userId, quizId, score, total) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Utilisateur non trouvé');
  
    user.quizzes.push({ quizId, score, total });
  
    await user.save(); // Les moyennes seront mises à jour automatiquement
    return user;
  };

  exports.updateUser = async (req, res) => {
    try {
      const { oldPassword, password, username, email } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Vérifier (optionnel) que l'utilisateur qui modifie
      // est bien le propriétaire du compte ou un admin
  
      // Changer le mot de passe, si fourni
      if (password) {
        // on suppose qu'on a oldPassword pour vérification
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Ancien mot de passe incorrect." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      // Changer le nom d'utilisateur, si fourni
      if (username) {
        user.username = username;
      }
  
      // Changer l'email, si fourni
      if (email) {
        user.email = email;
      }
  
      await user.save();
  
      res.status(200).json({
        message: "Utilisateur mis à jour avec succès.",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
    }
  };

  exports.promoteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Supposons que la promotion change le rôle de l'utilisateur
      user.role = "admin"; // Modifie selon ton système de rôles
      await user.save();
  
      res.status(200).json({ message: "Utilisateur promu avec succès.", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la promotion de l'utilisateur." });
    }
  };
  