import messages from '../messages'

import {
  noop
} from '../utils'

var debug = require('debug')('riqra-service-ads:controller-api')
var sql = require('../initializers/knex')

class ApiController {
  async getList (req, res) {
    // Get ads from database
    let ads = await sql('ads')

    if (ads.length === 0) {
      return res['404']({}, messages.adsItemNotFound)
    }

    let payload = {
      items: ads
    }
    return res.ok(payload, messages.itemUpdatedInCart)
  }

  async create (req, res) {
    // Validate body data
    if (req.body.name === undefined ||
      req.body.photo === undefined ||
      req.body.link === undefined ||
      req.body.name === '' ||
      req.body.photo === '' ||
      req.body.link === '') {
      return res['400']({}, messages.adsCreateBadRequest)
    }

    // Get body data
    let adsItemCreate = {
      name: req.body.name,
      photo: req.body.photo,
      link: req.body.link
    }

    // Create new ads
    let adsCreate = await sql('ads')
    .insert(adsItemCreate)
    .spread(noop)

    let adsId = adsCreate

    // Find element ads created
    let adsItem = await sql('ads')
    .where('id', adsId)
    .limit(1)
    .spread(noop)

    if (adsItem === undefined) {
      return res['404']({}, messages.adsItemNotFound)
    }

    let payload = {
      item: adsItem
    }
    return res['201'](payload, messages.adsItemCreated)
  }

  async getById (req, res) {
    let adsId = Number(req.params.id)

    let adsItem = await sql('ads')
    .where('id', adsId)
    .limit(1)
    .spread(noop)

    // Validate element found
    if (adsItem === undefined) {
      return res['404']({}, messages.adsItemNotFound)
    }

    let payload = {
      item: adsItem
    }
    return res.ok(payload, messages.adsItem)
  }

  async updateById (req, res) {
    // Validate body data
    if (req.body.name === undefined ||
        req.body.photo === undefined ||
        req.body.link === undefined ||
        req.body.name === '' ||
        req.body.photo === '' ||
        req.body.link === '') {
      return res['400']({}, messages.adsCreateBadRequest)
    }

    let adsItemID = Number(req.params.id)

    let adsItemFieldsToUpdate = {
      name: req.body.name,
      photo: req.body.photo,
      link: req.body.link
    }

    // update attributes
    let adsItemToUpdated = await sql('ads')
    .update(adsItemFieldsToUpdate)
    .where({id: adsItemID})

    // Validate element updated
    if (!adsItemToUpdated) {
      return res['404']({}, messages.adsItemNotFound)
    }

    // Find element updated
    let itemUpdated = await sql('ads')
    .where({id: adsItemID})
    .limit(1)
    .spread(noop)

    let payload = {
      item: itemUpdated
    }
    return res.ok(payload, messages.adsItemUpdated)
  }

  deleteById (req, res) {
    var adsId = Number(req.params.id)

    sql('ads')
    .where('id', adsId)
    .del()
    .then((itemDeleted) => {
      if (!itemDeleted) {
        return res['404']({}, messages.adsItemNotFound)
      }
      return res.ok({id: adsId}, messages.adsItemDeleted)
    })
  }
}

export {
  ApiController
}
