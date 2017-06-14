process.env.PROJECT_DIR = __dirname

require('require-self-ref')
require('app-module-path').addPath('~/lib')
require('~/lib/json-response')

const debug = require('debug')('riqra-service-ads:server')

const path = require('path')
const home = require('os').homedir()
const envPath = path.join(home, '.env')

debug('Server starting ENV =>', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  require('babel-polyfill')
  require('dotenv').config({path: envPath})
  require('~/dist/index')
} else {
  require('dotenv').config()
  require('~/src/index')
}
