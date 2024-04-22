const db = require('../db.config');
const errorHandler = require('../utils/errorHandler');
const checkObjectFields = require('../utils/validators');

async function getAllRevenues(req, res){
  try {
    const revenues = await db.query(`SELECT * FROM revenues ORDER BY date DESC`);
    const sum = await db.query(`SELECT SUM(amount) AS total_revenues FROM revenues`);
    res.status(200).json({
      data: revenues.rows
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

async function getAllExpenses(req, res){
  try {
    const expenses = await db.query(`SELECT * FROM expenses ORDER BY date DESC`);
    const sum = await db.query(`SELECT SUM(amount) AS total_expenses FROM expenses`);

    res.status(200).json({
      sum: sum.rows[0],

      data: expenses.rows
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

async function getResult(req, res){
  try {
    const net_profit = await db.query(`
    SELECT 
    total_revenues - total_expenses AS net_profit
    FROM 
    (SELECT COALESCE(SUM(amount), 0) AS total_revenues
    FROM revenues) AS revenues,
    (SELECT COALESCE(SUM(amount), 0) AS total_expenses
    FROM expenses) AS expenses;
    `);
    const sumOfexpenses = await db.query(`
      SELECT SUM(amount) AS total_expenses
      FROM expenses`);
    const sumOfrevenues = await db.query(`
      SELECT SUM(amount) AS total_revenues
      FROM revenues`);
    const result = Object.assign({}, sumOfrevenues.rows[0], sumOfexpenses.rows[0], net_profit.rows[0])
      res.status(200).json({
        result
      })
  } catch (error) {
    errorHandler(res, error)
  }
}

async function getRevenuesGroupBySource(req, res){
  try {
    const revenues = await db.query(`
      SELECT source, SUM(amount) AS total_revenue
      FROM revenues
      GROUP BY source;
    `);
      res.status(200).json(revenues.rows)

  } catch (error) {
    errorHandler(res, error)
  }
}

async function getExpensesGroupByCategory(req, res){
  try {
    const expenses = await db.query(`
      SELECT category, SUM(amount) AS total_expense
      FROM expenses
      GROUP BY category;
    `);
      res.status(200).json(expenses.rows)

  } catch (error) {
    errorHandler(res, error)
  }
}
async function getRevenuesAndExpenses(req, res){
  try {
    const expenses = await db.query(`
      WITH revenue_monthly AS (
      SELECT 
        EXTRACT(YEAR FROM date) AS year,
        EXTRACT(MONTH FROM date) AS month,
        source AS category,
        SUM(amount) AS amount
      FROM 
        revenues
      GROUP BY 
        year, month, category
      ),
      expense_monthly AS (
        SELECT 
          EXTRACT(YEAR FROM date) AS year,
          EXTRACT(MONTH FROM date) AS month,
          category,
          SUM(amount) AS amount
        FROM 
          expenses
        GROUP BY 
          year, month, category
      )
      SELECT 
      COALESCE(r.year, e.year) AS year,
      COALESCE(r.month, e.month) AS month,
      COALESCE(r.category, e.category) AS category,
      COALESCE(r.amount, 0) AS revenue_amount,
      COALESCE(e.amount, 0) AS expense_amount
      FROM 
      revenue_monthly r
      FULL OUTER JOIN 
      expense_monthly e
      ON 
      r.year = e.year AND r.month = e.month AND r.category = e.category
      ORDER BY 
      year, month, category;
      `);
      res.status(200).json(expenses.rows)
  } catch (error) {
    errorHandler(res, error)
  }
}

module.exports = {
  getAllRevenues,
  getAllExpenses,
  getResult,
  getRevenuesGroupBySource,
  getExpensesGroupByCategory,
  getRevenuesAndExpenses
}