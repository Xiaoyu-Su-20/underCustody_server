const Pool = require('pg').Pool;

const pool = new Pool ({
  user:'postgres',
  password:'database1',
  host:'localhost',
  port:5432,
  database:'cany'
})

module.exports = pool;
