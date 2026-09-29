
const router = require('express').Router();
const { registerUser, loginUser } = require("../../controllers/userController")

// POST /api/users/register - Create a new user
router.post('/register', registerUser);

// POST /api/users/login - Authenticate a user and return a token
router.post('/login', loginUser);

module.exports = router;