import {AdsController} from '~/src/controllers/ads'

var debug = require('debug')('riqra-service-partner:routes-ads')

var adsController = new AdsController()

var express = require('express')
var router = express.Router()

router.get('/', adsController.getList)
router.post('/', adsController.create)
router.get('/:id', adsController.getById)
router.put('/:id', adsController.updateById)
router.delete('/:id', adsController.deleteById)

module.exports = router
