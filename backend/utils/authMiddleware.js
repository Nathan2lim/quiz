const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    // Récupérer le token dans l'en-tête Authorization (format "Bearer <token>")
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Format de token invalide' });
    }
    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: 'Format de token invalide' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On stocke l'info dans req.user
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token invalide' });
  }
};
