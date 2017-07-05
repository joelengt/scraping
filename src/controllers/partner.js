import messages from '~/src/messages'
import {
  noop
} from '~/src/utils'

var debug = require('debug')('riqra-service-partner:controller-partner')
var sql = require('../initializers/knex')

class PartnerController {
  async getBySlugify (req, res) {
    // Get uri param by partnerSlugify
    let partnerSlugify = req.params.partnerSlugify

    try {
      // find partner by slugify on DB
      let partner = await sql('partner')
      .where('name_slugify', partnerSlugify)
      .limit(1)
      .spread(noop)

      // validate if partner was found
      if (!partner) {
        return res['404']({success: false}, messages.partnerNotFound)
      }

      let payload = {
        item: partner
      }

      return res.ok(payload, messages.partnerFound)
    } catch (err) {
      res['400']({success: false}, err)
    }
  }

  async getList (req, res) {
    try {
      // Get partner from database
      let partner = await sql('partner')

      // Validate if partner was found
      if (!partner.length) {
        return res['404']({success: false}, messages.partnerNotFound)
      }

      let payload = {
        items: partner
      }

      return res.ok(payload, messages.partnerFound)
    } catch (err) {
      res['400']({success: false}, err)
    }
  }

  async create (req, res) {
    // Get body data
    let partnerItemCreate = req.body

    try {
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

      // Validate if partner was found
      if (!partnerItem) {
        return res['404']({success: false}, messages.partnerFound)
      }

      let payload = {
        item: partnerItem
      }

      return res['201'](payload, messages.partnerCreated)
    } catch (err) {
      res['400']({success: false}, err)
    }
  }

  async getById (req, res) {
    // Get uri params id
    let partnerId = req.params.id

    try {
      // Find parner by id on DB
      let partnerItem = await sql('partner')
      .where('id', partnerId)
      .limit(1)
      .spread(noop)

      // Validate if element was found
      if (!partnerItem) {
        return res['404']({success: false}, messages.partnerNotFound)
      }

      let payload = {
        item: partnerItem
      }

      return res.ok(payload, messages.partnerFound)
    } catch (err) {
      res['400']({success: false}, err)
    }
  }

  async updateById (req, res) {
    // Get uri params id
    let partnerItemID = req.params.id

    // Get body attributes
    let partnerItemFieldsToUpdate = req.body

    try {
      // update attributes on DB
      let partnerItemToUpdated = await sql('partner')
      .update(partnerItemFieldsToUpdate)
      .where({'id': partnerItemID})

      // Validate element updated
      if (!partnerItemToUpdated) {
        return res['404']({success: false}, messages.partnerNotFound)
      }

      // Find element updated
      let itemUpdated = await sql('partner')
      .where({id: partnerItemID})
      .limit(1)
      .spread(noop)

      let payload = {
        item: itemUpdated
      }

      return res.ok(payload, messages.partnerUpdated)
    } catch (err) {
      res['400']({success: false}, err)
    }
  }

  async updateOptionalById (req, res) {
    // Get uri params id
    let partnerItemID = req.params.id

    // Get body attributes
    let partnerItemFieldsToUpdate = req.body

    try {
      // update attributes on DB
      let partnerItemToUpdated = await sql('partner')
      .update(partnerItemFieldsToUpdate)
      .where({'id': partnerItemID})

      // Validate element updated
      if (!partnerItemToUpdated) {
        return res['404']({success: false}, messages.partnerNotFound)
      }

      // Find element updated
      let itemUpdated = await sql('partner')
      .where({id: partnerItemID})
      .limit(1)
      .spread(noop)

      let payload = {
        item: itemUpdated
      }

      return res.ok(payload, messages.partnerUpdated)
    } catch (err) {
      res['400']({success: false}, err)
    }
  }

  async deleteById (req, res) {
    // Get uri params id
    var partnerId = req.params.id

    try {
      let partner = await sql('partner')
      .where('id', partnerId)
      .del()

      // Validate if partner was found
      if (!partner) {
        return res['404']({success: false}, messages.partnerNotFound)
      }

      return res.ok({id: partnerId}, messages.partnerDeleted)
    } catch (err) {
      return res['400']({success: false}, err)
    }
  }
}

export {
  PartnerController
}
