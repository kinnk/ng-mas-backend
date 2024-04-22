const express = require('express');
const router = express.Router();
const controller = require('../controllers/finance.controller')

router.get('/result', controller.getResult);
router.get('/revenuesBySource', controller.getRevenuesGroupBySource);
router.get('/expensesByCategory', controller.getExpensesGroupByCategory);
router.get('/revenues', controller.getAllRevenues);
router.get('/expenses', controller.getAllExpenses);
router.get('/revenues&expenses', controller.getRevenuesAndExpenses);

module.exports = router;