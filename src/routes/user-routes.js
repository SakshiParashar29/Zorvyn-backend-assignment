const express = require('express');
const {getUserProfile, getAllUsers, getUserById, updateUserRole, activateUser, deactivateUser} = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const roleMiddleware = require('../middleware/role-middleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.get('/all', authMiddleware, roleMiddleware('Admin'), getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware('Admin'), getUserById)
router.post('/role/:id', authMiddleware, roleMiddleware('Admin'), updateUserRole);
router.patch('/activate/:id', authMiddleware, roleMiddleware("Admin"), activateUser);
router.patch('/deactivate/:id', authMiddleware, roleMiddleware("Admin"), deactivateUser);

module.exports = router;
