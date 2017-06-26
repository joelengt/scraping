import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import methodOverride from 'method-override'

var debug = require('debug')('riqra-service-partner:index')
const app = express()
const server = require('http').Server(app)
const port = process.env.PORT

// Allow Cors Header
function allowCrossTokenHeader (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization')
  next()
}

// Config Server
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(allowCrossTokenHeader)

require('./initializers/routes')(app)

// Server Listen
server.listen(port, (err) => {
  if (err) return debug(`Error: Server not started - ${err}`)
  debug(`Server listing on port ${port}`)
})
