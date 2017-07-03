import messages from '~/src/messages'

import {
  noop
} from '~/src/utils'

var debug = require('debug')('riqra-service-partner:controller-ads')
var sql = require('../initializers/knex')

class AdsController {
  async getList (req, res) {
    try {
      // Get ads from database
      let ads = await sql('ads')

      if (ads.length === 0) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let payload = {
        items: ads
      }
      return res.ok(payload, messages.itemUpdatedInCart)
    } catch (err) {
      return res['404']({success: false}, err)
    }
  }

  async create (req, res) {
    try {
      // Validate body data
      if (req.body.name === undefined ||
        req.body.photo === undefined ||
        req.body.link === undefined ||
        req.body.name === '' ||
        req.body.photo === '' ||
        req.body.link === '') {
        return res['400']({success: false}, messages.adsCreateBadRequest)
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
      .returning('*')
      .catch((err) => {
        let payload = {
          status: 400,
          data: {
            error: err.detail
          },
          message: 'Error en los campos'
        }
        return payload
      })
      .spread(noop)

      if (adsCreate.status) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let adsId = adsCreate.id

      // Find element ads created
      let adsItem = await sql('ads')
      .where('id', adsId)
      .limit(1)
      .spread(noop)

      if (adsItem === undefined) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let payload = {
        item: adsItem
      }
      return res['201'](payload, messages.adsItemCreated)
    } catch (err) {
      return res['404']({success: false}, err)
    }
  }

  async getById (req, res) {
    try {
      let adsId = Number(req.params.id)

      let adsItem = await sql('ads')
      .where('id', adsId)
      .limit(1)
      .spread(noop)

      // Validate element found
      if (adsItem === undefined) {
        return res['404']({success: false}, messages.adsItemNotFound)
      }

      let payload = {
        item: adsItem
      }
      return res.ok(payload, messages.adsItem)
    } catch (err) {
      return res['404']({success: false}, err)
    }
  }

  async updateById (req, res) {
    try {
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
        return res['404']({success: false}, messages.adsItemNotFound)
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
    } catch (err) {
      res['404']({success: false}, err)
    }
  }

  async deleteById (req, res) {
    try {
      var adsId = Number(req.params.id)

      let ads = await sql('ads')
      .where('id', adsId)
      .del()

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
