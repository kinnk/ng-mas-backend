const db = require('../db.config');
const errorHandler = require('../utils/errorHandler');
const checkObjectFields = require('../utils/validators');

async function getAll(req,res){
  try {
    const departments = await db.query(`
      SELECT DISTINCT ON (name) * 
      FROM departments
      ORDER BY name;
    `);
    res.status(200).json(departments.rows);
  } catch (error) {
    errorHandler(res, error);
  }
}



module.exports = {
  getAll
}