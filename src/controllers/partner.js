import messages from '../messages'

import {
  noop
} from '../utils'

var debug = require('debug')('riqra-service-partner:controller-partner')
var sql = require('../initializers/knex')

class PartnerController {
  async getList (req, res) {
    // Get partner from database
    let partner = await sql('partner')

    if (partner.length === 0) {
      return res['404']({}, messages.partnerItemNotFound)
    }

    let payload = {
      items: partner
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
      return res['400']({}, messages.partnerCreateBadRequest)
    }

    // Get body data
    let partnerItemCreate = {
      name: req.body.name,
      photo: req.body.photo,
      link: req.body.link
    }

    // Create new partner
    let partnerCreate = await sql('partner')
    .insert(partnerItemCreate)
    .spread(noop)

    let partnerId = partnerCreate

    // Find element partner created
    let partnerItem = await sql('partner')
    .where('id', partnerId)
    .limit(1)
    .spread(noop)

    if (partnerItem === undefined) {
      return res['404']({}, messages.partnerItemNotFound)
    }

    let payload = {
      item: partnerItem
    }
    return res['201'](payload, messages.partnerItemCreated)
  }

  async getById (req, res) {
    let partnerId = Number(req.params.id)

    let partnerItem = await sql('partner')
    .where('id', partnerId)
    .limit(1)
    .spread(noop)

    // Validate element found
    if (partnerItem === undefined) {
      return res['404']({}, messages.partnerItemNotFound)
    }

    let payload = {
      item: partnerItem
    }
    return res.ok(payload, messages.partnerItem)
  }

  async updateById (req, res) {
    // Validate body data
    if (req.body.name === undefined ||
        req.body.photo === undefined ||
        req.body.link === undefined ||
        req.body.name === '' ||
        req.body.photo === '' ||
        req.body.link === '') {
      return res['400']({}, messages.partnerCreateBadRequest)
    }

    let partnerItemID = Number(req.params.id)

    let partnerItemFieldsToUpdate = {
      name: req.body.name,
      photo: req.body.photo,
      link: req.body.link
    }

    // update attributes
    let partnerItemToUpdated = await sql('partner')
    .update(partnerItemFieldsToUpdate)
    .where({id: partnerItemID})

    // Validate element updated
    if (!partnerItemToUpdated) {
      return res['404']({}, messages.partnerItemNotFound)
    }

    // Find element updated
    let itemUpdated = await sql('partner')
    .where({id: partnerItemID})
    .limit(1)
    .spread(noop)

    let payload = {
      item: itemUpdated
    }
    return res.ok(payload, messages.partnerItemUpdated)
  }

  deleteById (req, res) {
    var partnerId = Number(req.params.id)

    sql('partner')
    .where('id', partnerId)
    .del()
    .then((itemDeleted) => {
      if (!itemDeleted) {
        return res['404']({}, messages.partnerItemNotFound)
      }
      return res.ok({id: partnerId}, messages.partnerItemDeleted)
    })
  }
}

export {
  PartnerController
}
