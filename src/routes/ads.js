import {AdsController} from '~/src/controllers/ads'

var debug = require('debug')('riqra-service-partner:routes-ads')
const { validateParam, validateBody, schemas } = require('~/src/utils')

var adsController = new AdsController()

var express = require('express')
var router = express.Router()

router.route('/start')
  .post(adsController.getStart)

module.exports = router
