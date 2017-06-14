import {ApiController} from '~/src/controllers/api'

var debug = require('debug')('riqra-service-ads:api')

var ApiControllerSource = new ApiController()

var express = require('express')
var router = express.Router()

router.get('/brand', (req, res) => ApiControllerSource.getList(req, res))
router.post('/brand', (req, res) => ApiControllerSource.create(req, res))
router.get('/brand/:id', (req, res) => ApiControllerSource.getById(req, res))
router.put('/brand/:id', (req, res) => ApiControllerSource.updateById(req, res))
router.delete('/brand/:id', (req, res) => ApiControllerSource.deleteById(req, res))

module.exports = router
