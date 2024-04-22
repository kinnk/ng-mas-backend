const Pool = require('pg').Pool;
// congigure db connection postgresql
const pool = new Pool({
  user: 'postgres',
  password: '12345',
  port: 5432,
  host: 'localhost',
  database: 'mas'
})

module.exports = pool;
// sssss