const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { verifyToken } = require('../utils/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/protected
router.get('/protected', verifyToken, authController.protectedRoute);

// POST /auth/users        -> créer un user
router.post('/', userController.createUser);

// GET /api/auth        -> récupérer tous les users
router.get('/', userController.getAllUsers);

// GET /auth/users/:id     -> récupérer un user par ID
router.get('/:id', userController.getUserById);

// PUT /auth/users/:id     -> mettre à jour un user
router.put('/:id', userController.updateUser);

// DELETE /auth/users/:id  -> supprimer un user
router.delete('/:id', userController.deleteUser);


module.exports = router;
