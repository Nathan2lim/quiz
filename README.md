## 📌 Routes API (Auth & Quiz)

| 🚀 Fonctionnalité          | 🔥 Méthode | 🌍 Endpoint        | 📩 Body (exemple) | 🎯 Réponse (exemple) |
|----------------------------|-----------|--------------------|-------------------|-------------------|
| **🔑 Authentification**    |          |                    |                   |                   |
| 👤 Inscription             | `POST`    | `/api/auth/register` | `{ "email": "...", "password": "..." }` | `{ "message": "OK", "user": { "id": "123" }}
| 🔓 Connexion               | `POST`    | `/api/auth/login` | `{ "email": "...", "password": "..." }` | `{ "token": "JWT_TOKEN" }` |
| 🚪 Déconnexion             | `POST`    | `/api/auth/logout` | `N/A` | `{ "message": "Déconnecté" }` |
| 🕵️‍♂️ Utilisateur connecté    | `GET`     | `/api/auth/me` | `Header: Bearer TOKEN` | `{ "id": "123", "username": "user" }` |
| **📜 Gestion du Quiz**      |           |                    |                   |                   |
| 🎯 Créer une question      | `POST`    | `/api/quiz` | `{ "question": "...", "reponse1": "..." }` | `{ "message": "Créé" }` |
| 📖 Toutes les questions    | `GET`     | `/api/quiz` | `N/A` | `[ { "id": 1, "question": "..." }, ...]` |
| 🔍 Question par ID         | `GET`     | `/api/quiz/:id` | `N/A` | `{ "id": 1, "question": "..." }` |
| 📝 Modifier une question   | `PUT`     | `/api/quiz/:id` | `{ "question": "..." }` | `{ "message": "Mis à jour" }` |
| ❌ Supprimer une question  | `DELETE`  | `/api/quiz/:id` | `N/A` | `{ "message": "Supprimé" }` |
