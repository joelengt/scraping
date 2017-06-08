import knexfile from '../../knexfile'
const config = knexfile[process.env.NODE_ENV]

const knex = require('knex')(config)

export default knex
