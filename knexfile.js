const _ = require('lodash')

const base = {
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },
  pool: {
    min: 2,
    max: 10
  }
}

module.exports = {
  development: _.assign({debug: true}, base),
  staging: base,
  test: base,
  production: base
}
