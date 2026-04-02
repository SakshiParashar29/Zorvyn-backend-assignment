const express = require('express');

const {createTransaction, getAllTransaction, getTransactionById, updateTransaction, deleteTransaction} = require('../controllers/transaction-controller');

const authMiddleware = require('../middleware/auth-middleware');
const roleMiddleware = require('../middleware/role-middleware');

const router = express.Router();

router.post('/create', authMiddleware, roleMiddleware('Admin'), createTransaction);
router.get('/all', authMiddleware, roleMiddleware('Analyst', 'Admin'), getAllTransaction);
router.get('/:id', authMiddleware, roleMiddleware("Analyst", 'Admin'), getTransactionById);
router.put('/:id', authMiddleware, roleMiddleware('Admin'), updateTransaction);
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), deleteTransaction);

module.exports = router;