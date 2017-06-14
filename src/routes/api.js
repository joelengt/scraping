import {ApiController} from '~/src/controllers/api'

var debug = require('debug')('riqra-service-ads:api')

var ApiControllerSource = new ApiController()

var express = require('express')
var router = express.Router()

router.get('/brand', ApiControllerSource.getList)
router.post('/brand', ApiControllerSource.create)
router.get('/brand/:id', ApiControllerSource.getById)
router.put('/brand/:id', ApiControllerSource.updateById)
router.delete('/brand/:id', ApiControllerSource.deleteById)

module.exports = router
