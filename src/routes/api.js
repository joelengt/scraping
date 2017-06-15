import {ApiController} from '~/src/controllers/api'

var debug = require('debug')('riqra-service-ads:api')

var ApiControllerSource = new ApiController()

var express = require('express')
var router = express.Router()

router.get('/ads', ApiControllerSource.getList)
router.post('/ads', ApiControllerSource.create)
router.get('/ads/:id', ApiControllerSource.getById)
router.put('/ads/:id', ApiControllerSource.updateById)
router.delete('/ads/:id', ApiControllerSource.deleteById)

module.exports = router
