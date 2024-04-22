const express = require('express');
const router = express.Router();
const controller = require('../controllers/departments.controller')
// список всех
// добавление новых
// редактирование информации
router.get('/all', controller.getAll);


module.exports = router;