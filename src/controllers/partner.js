import messages from '~/src/messages'

import {
  noop
} from '~/src/utils'

var debug = require('debug')('riqra-service-partner:controller-partner')
var sql = require('../initializers/knex')

class PartnerController {
  async getBySlugify (req, res) {
    try {
      let partnerSlugify = req.params.partnerSlugify

      // find partner by slugify
      let partner = await sql('partner')
      .where('name_slugify', partnerSlugify)
      .limit(1)
      .spread(noop)

      if (!partner) {
        return res['404']({success: false}, 'The partner slugify is not found')
      }

      let payload = {
        item: partner
      }

      return res.ok(payload, 'partner found')
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async getList (req, res) {
    try {
      // Get partner from database
      let partner = await sql('partner')

      if (partner.length === 0) {
        return res['404']({success: false}, messages.partnerItemNotFound)
      }

      let payload = {
        items: partner
      }
      return res.ok(payload, messages.itemUpdatedInCart)
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async create (req, res) {
    try {
      // Validate body data
      if (req.body.name === undefined ||
        req.body.logo === undefined ||
        req.body.nameSlugify === undefined ||
        req.body.name === '' ||
        req.body.logo === '' ||
        req.body.nameSlugify === '') {
        return res['400']({success: false}, messages.partnerCreateBadRequest)
      }

      // Get body data
      let partnerItemCreate = {
        name: req.body.name,
        logo: req.body.logo,
        name_slugify: req.body.nameSlugify
      }

      // Create new partner
      let partnerCreate = await sql('partner')
      .insert(partnerItemCreate)
      .returning('*')
      .spread(noop)

      let partnerId = partnerCreate.id

      // Find element partner created
      let partnerItem = await sql('partner')
      .where('id', partnerId)
      .limit(1)
      .spread(noop)

      if (partnerItem === undefined) {
        return res['404']({success: false}, messages.partnerItemNotFound)
      }

      let payload = {
        item: partnerItem
      }
      return res['201'](payload, messages.partnerItemCreated)
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async getById (req, res) {
    try {
      let partnerId = Number(req.params.id)

      let partnerItem = await sql('partner')
      .where('id', partnerId)
      .limit(1)
      .spread(noop)

      // Validate element found
      if (partnerItem === undefined) {
        return res['404']({success: false}, messages.partnerItemNotFound)
      }

      let payload = {
        item: partnerItem
      }
      return res.ok(payload, messages.partnerItem)
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async updateById (req, res) {
    try {
      // Validate body data
      if (req.body.name === undefined ||
        req.body.logo === undefined ||
        req.body.nameSlugify === undefined ||
        req.body.name === '' ||
        req.body.logo === '' ||
        req.body.nameSlugify === '') {
        return res['400']({success: false}, messages.partnerCreateBadRequest)
      }

      let partnerItemID = Number(req.params.id)

      let partnerItemFieldsToUpdate = {
        name: req.body.name,
        logo: req.body.logo,
        name_slugify: req.body.nameSlugify
      }

      // update attributes
      let partnerItemToUpdated = await sql('partner')
      .update(partnerItemFieldsToUpdate)
      .where({id: partnerItemID})

      // Validate element updated
      if (!partnerItemToUpdated) {
        return res['404']({success: false}, messages.partnerItemNotFound)
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
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async deleteById (req, res) {
    try {
      var partnerId = Number(req.params.id)

      let partner = await sql('partner')
      .where('id', partnerId)
      .del()

      if (!partner) {
        return res['404']({success: false}, messages.partnerItemNotFound)
      }
      return res.ok({id: partnerId}, messages.partnerItemDeleted)
    } catch (err) {
      return res['404']({success: false}, err)
    }
  }
}

export {
  PartnerController
}
