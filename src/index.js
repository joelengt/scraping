import path from 'path'
import cors from 'cors'

import express from 'express'
import bodyParser from 'body-parser'

import graphqlHTTP from 'express-graphql'
import loaders from './loaders'

import schema from './schema'

const debug = require('debug')('riqra-api:server')

const app = express()

app.use(bodyParser.json())

const port = process.env.PORT

app.use('/', cors(), graphqlHTTP((req) => {
  let baseUrl = `${req.protocol}://${req.headers.host}`

  process.env.BASE_URL = baseUrl

  return {
    schema,
    graphiql: true,
    context: {
      user: req.user,
      loaders: loaders()
    }
  }
}))

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  }
})

app.listen(port, () => debug(`server listing on port ${port}`))
