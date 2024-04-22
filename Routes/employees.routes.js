const express = require('express');
const router = express.Router();
const controller = require('../controllers/employees.controller')
// список всех
// добавление новых
// редактирование информации
router.get('/all', controller.getAll);
router.post('/', controller.create);
router.patch('/:employeeId', controller.edit);

module.exports = router;
