import {PartnerController} from '~/src/controllers/partner'

var debug = require('debug')('riqra-service-partner:routes-partners')
const { validateParam, validateBody, schemas } = require('~/src/utils')

var partnerController = new PartnerController()  // export from index

var express = require('express')
var router = express.Router()

router.route('/find-slugify/:partnerSlugify')
  .get(validateParam(schemas.partnerSlugifySchema),
      partnerController.getBySlugify)

router.route('/')
  .get(partnerController.getList)
  .post(validateBody(schemas.partnerSchema), partnerController.create)

router.route('/:id')
  .get(validateParam(schemas.partnerIDSchema), partnerController.getById)

  .put(validateParam(schemas.partnerIDSchema),
      validateBody(schemas.partnerSchema),
      partnerController.updateById)

  .patch(validateParam(schemas.partnerIDSchema),
      validateBody(schemas.partnerOptionalSchema),
      partnerController.updateOptionalById)

  .delete(validateParam(schemas.partnerIDSchema),
      partnerController.deleteById)

module.exports = router
