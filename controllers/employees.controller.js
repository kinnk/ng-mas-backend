const db = require('../db.config');
const errorHandler = require('../utils/errorHandler');
const checkObjectFields = require('../utils/validators');

async function getAll(req,res){
  try {
    const employees = await db.query(`
      SELECT employees.id, employees.name, to_char(employees.hire_date, 'DD-MM-YYYY') AS hire_date, employees.position, employees.salary, 
      departments.id AS department_id, departments.name AS department_name
      FROM employees
      JOIN departments ON employees.department_id = departments.id;
    `);
    res.status(200).json(employees.rows);
  } catch (error) {
    errorHandler(res, error);
  }
}

async function create(req,res){
  try {
    const { name, hire_date, position, department_id, salary } = req.body;
    // Проверяем поля
    // checkObjectFields(res, req.body);
    // Добавление в бд
    const employe = await db.query(`
      INSERT INTO employees (name, hire_date, position, department_id, salary) 
      VALUES ($1, $2, $3, $4, $5)`, [name, hire_date, position, department_id, salary]
    );

    if (employe.rowCount !== 1) {
      return res.status(500).json({
        message: 'Не удалось добавить сотрудника'
      });
    }
    res.status(201).json({
      message: `Сотрудник ${name} успешно добавлен!`
    })
  } catch (error) {
    errorHandler(res, error);
  }
}

async function edit(req, res){
  try{
    const employeeId = req.params.employeeId;
    // Проверка полей '' null undefined 
    // checkObjectFields(res, req.body);

    const {name, hire_date, position, department_id, salary} = req.body;

    await db.query(`
      UPDATE employees 
      SET name = $1, hire_date = $2, position = $3, department_id = $4, salary = $5
      WHERE id = $6`,
      [name, hire_date, position, department_id, salary, employeeId]
    );
    res.status(200).json({
      message:'Данные сотрудника изменены!'
    });
  }catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  getAll,
  create,
  edit
}