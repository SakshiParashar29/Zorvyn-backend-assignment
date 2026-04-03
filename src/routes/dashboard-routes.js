const express = require('express');
const {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getWeeklyTrends,
    getRecentActivity
} = require('../controllers/dashboard-controller');
const authMiddleware = require('../middleware/auth-middleware');
const roleMiddleware = require('../middleware/role-middleware');

const router = express.Router();

router.get('/summary', authMiddleware, roleMiddleware('Viewer', 'Analyst', 'Admin'), getSummary);          
router.get('/recent', authMiddleware, roleMiddleware('Viewer', 'Analyst', 'Admin'), getRecentActivity);       
router.get('/categories', authMiddleware, roleMiddleware('Analyst', 'Admin'), getCategoryTotals);            
router.get('/trends/monthly', authMiddleware, roleMiddleware('Analyst', 'Admin'), getMonthlyTrends);                
router.get('/trends/weekly', authMiddleware, roleMiddleware('Analyst', 'Admin'), getWeeklyTrends);                 

module.exports = router;