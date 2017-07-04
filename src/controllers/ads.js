import messages from '~/src/messages'
import {
  noop
} from '~/src/utils'

var debug = require('debug')('riqra-service-partner:controller-ads')
var sql = require('../initializers/knex')

class AdsController {
  async getList (req, res) {
    // Get uri param partnerId
    let partnerId = Number(req.params.partnerId)

    try {
      // Get ads from database
      let ads = await sql('ads')
      .where({'partner_id': partnerId})

      // Validate if Ads was found
      if (!ads.length) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let payload = {
        items: ads
      }

      return res.ok(payload, messages.adsItemFound)
    } catch (err) {
      return res['400']({success: false}, err)
    }
  }

  async create (req, res) {
    // Validate body data
    if (req.body.name === undefined ||
      req.body.photo === undefined ||
      req.body.link === undefined ||
      req.body.partner_id === undefined ||
      req.body.name === '' ||
      req.body.photo === '' ||
      req.body.link === '' ||
      req.body.partner_id === '') {
      return res['400']({success: false}, messages.adsFieldBadRequest)
    }
    // Get uri param partnerId
    let partnerId = req.params.partnerId

    // Get body data to craete a new ads
    let adsItemCreate = {
      name: req.body.name,
      photo: req.body.photo,
      link: req.body.link,
      partner_id: Number(partnerId)
    }

    try {
      // Create new ads
      let adsCreate = await sql('ads')
      .insert(adsItemCreate)
      .returning('*')
      .spread(noop)

      // Validate if element was updated
      if (!adsCreate) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let adsId = adsCreate.id

      // Find element ads created
      let adsItem = await sql('ads')
      .where({'id': adsId, 'partner_id': partnerId})
      .limit(1)
      .spread(noop)

      // Validate if element was updated
      if (!adsItem) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let payload = {
        item: adsItem
      }
      return res['201'](payload, messages.adsItemCreated)
    } catch (err) {
      return res['400']({success: false}, err)
    }
  }

  async getById (req, res) {
    // Get uri params id, partnerId
    let adsId = Number(req.params.id)
    let partnerId = Number(req.params.partnerId)

    try {
      // Find ads by id, partnerId on DB
      let adsItem = await sql('ads')
      .where({'id': adsId, 'partner_id': partnerId})
      .limit(1)
      .spread(noop)

      // Validate if element was updated
      if (!adsItem) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let payload = {
        item: adsItem
      }

      return res.ok(payload, messages.adsItemFound)
    } catch (err) {
      return res['404']({success: false}, err)
    }
  }

  async updateById (req, res) {
    // Validate body data
    if (req.body.name === undefined ||
      req.body.photo === undefined ||
      req.body.link === undefined ||
      req.body.name === '' ||
      req.body.photo === '' ||
      req.body.link === '') {
      return res['400']({}, messages.adsFieldBadRequest)
    }
    // Get uri params id, partnerId
    let adsItemID = Number(req.params.id)
    let partnerId = Number(req.params.partnerId)

    // Get body data to craete a new ads
    let adsItemFieldsToUpdate = {
      name: req.body.name,
      photo: req.body.photo,
      link: req.body.link
    }

    try {
      // update attributes on DB
      let adsItemToUpdated = await sql('ads')
      .update(adsItemFieldsToUpdate)
      .where({'id': adsItemID, 'partner_id': partnerId})

      // Validate if element was updated
      if (!adsItemToUpdated) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      // Find element updated
      let itemUpdated = await sql('ads')
      .where({'id': adsItemID, 'partner_id': partnerId})
      .limit(1)
      .spread(noop)

      let payload = {
        item: itemUpdated
      }

      return res.ok(payload, messages.adsItemUpdated)
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async deleteById (req, res) {
    // Get uri params id, partnerId
    let adsId = Number(req.params.id)
    let partnerId = Number(req.params.partnerId)

    try {
      // Delete ads by id, partnerId on DB
      let ads = await sql('ads')
      .where({'id': adsId, 'partner_id': partnerId})
      .del()

      // Validate if ads was deleteted
      if (!ads) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      return res.ok({id: adsId}, messages.adsItemDeleted)
    } catch (err) {
      res['404']({success: false}, err)
    }
  }
}

export {
  AdsController
}
