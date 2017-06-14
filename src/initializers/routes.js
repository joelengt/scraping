var debug = require('debug')('riqra-service-ads:routes')

var apiRouter = require('~/src/routes/api')

module.exports = (app) => {
  app.use('/api', apiRouter)

  // Middleware express 401
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token...')
    }
  })

  // Middleware express 404
  app.use((req, res, next) => {
    res.status(404).send('404 : Not Found')
  })

  // Middleware express 500
  app.use((err, req, res, next) => {
    res.status(500).send('500 : Server Error')
  })
}
