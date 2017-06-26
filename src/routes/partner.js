import {PartnerController} from '~/src/controllers/partner'

var debug = require('debug')('riqra-service-partner:routes-partners')

var partnerController = new PartnerController()

var express = require('express')
var router = express.Router()

router.get('/find-slugify/:partnerSlugify', partnerController.getBySlugify)
// router.get('/', partnerController.getList)
// router.post('/', partnerController.create)
// router.get('/:id', partnerController.getById)
// router.put('/:id', partnerController.updateById)
// router.delete('/:id', partnerController.deleteById)

module.exports = router
