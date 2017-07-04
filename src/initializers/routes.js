var debug = require('debug')('riqra-service-ads:routes')

var adsRouter = require('~/src/routes/ads')
var partnerRouter = require('~/src/routes/partner')

module.exports = (app) => {
  app.use('/api/ads', adsRouter)
  app.use('/api/partner', partnerRouter)

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
