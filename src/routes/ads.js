import {AdsController} from '~/src/controllers/ads'

var debug = require('debug')('riqra-service-partner:routes-ads')

var adsController = new AdsController()

var express = require('express')
var router = express.Router()

router.get('/partner/:partnerId', adsController.getList)
router.post('/partner/:partnerId', adsController.create)
router.get('/:id/partner/:partnerId', adsController.getById)
router.put('/:id/partner/:partnerId', adsController.updateById)
router.delete('/:id/partner/:partnerId', adsController.deleteById)

module.exports = router
