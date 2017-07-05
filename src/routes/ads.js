import {AdsController} from '~/src/controllers/ads'

var debug = require('debug')('riqra-service-partner:routes-ads')
const { validateParam, validateBody, schemas } = require('~/src/utils')

var adsController = new AdsController()

var express = require('express')
var router = express.Router()

router.route('/partner/:partnerId')
  .get(validateParam(schemas.partIDSchema),
      adsController.getList)

  .post(validateParam(schemas.partIDSchema),
      validateBody(schemas.adsSchema),
      adsController.create)

router.route('/:id/partner/:partnerId')
  .get(validateParam(schemas.adsIDSchema),
      adsController.getById)

  .put(validateParam(schemas.adsIDSchema),
      validateBody(schemas.adsUpdatedSchema),
      adsController.updateById)

  .delete(validateParam(schemas.adsIDSchema),
      adsController.deleteById)

module.exports = router
