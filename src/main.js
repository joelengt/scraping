// @flow

require('dotenv').config() // eslint-disable-line

const app = require('./app').default
const port = process.env.APP_PORT

app.listen(port, '0.0.0.0', () => { // eslint-disable-line
  console.log(`  Server listening at http://localhost:${port}\n`) // eslint-disable-line
})
