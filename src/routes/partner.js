import {PartnerController} from '~/src/controllers/partner'

var debug = require('debug')('riqra-service-partner:routes-partners')
const { validateParam, validateBody, schemas } = require('~/src/utils')

var partnerController = new PartnerController()  // export from index

var express = require('express')
var router = express.Router()

var axios = require('axios')

var service = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

router.get('/test', (req, res) => {
  service.get('http://service-catalog/api/brand/test')
  .then((result) => {
    res.status(200).json(result)
  })
  .catch((error) => {
    debug('data?', error)
    // res.status(500).json({
    //   success: false,
    //   error: error
    // })
    res.send('error')
  })
})

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
