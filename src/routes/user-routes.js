const express = require('express');
const {getUserProfile, getAllUsers} = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const roleMiddleware = require('../middleware/role-middleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.get('/all', authMiddleware, roleMiddleware('Admin'), getAllUsers);

module.exports = router;
