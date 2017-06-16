process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const _ = require('lodash')
const path = require('path')
const home = require('os').homedir()
const envPath = path.join(home, '.env')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
} else {
  require('dotenv').config({path: envPath})
}

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
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: `${__dirname}/src/data/migrations`
  },
  seeds: {
    directory: `${__dirname}/src/data/seeds`
  }
}

module.exports = {
  development: _.assign({debug: true}, base),
  staging: base,
  test: base,
  production: base
}
