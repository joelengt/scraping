process.env.PROJECT_DIR = __dirname

const path = require('path')
const home = require('os').homedir()
const envPath = path.join(home, '.env')

if (process.env.NODE_ENV === 'production') {
  require('babel-polyfill')
  require('dotenv').config({path: envPath})
  require('./dist/index')
} else {
  require('dotenv').config()
  require('./src/index')
}
