import {noop} from '../../utils'
import _ from 'lodash'

require('dotenv').config()
var sql = require('../../initializers/knex')
var axios = require('axios')

var service = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

let URI = 'http://' + process.env.HOST + ':' + process.env.PORT

// Testing response json
test('it route create new partner item - POST /api/partner - payload', async () => {
  let body = {
    name_slugify: 'cromlu3',
    logo: '/something.AAA',
    name: 'cromlu sac',
    background_color: '#ff0011',
    product_add_button_color: '#ff0022',
    cart_button_color: '#ff0033',
    product_info_color: '#ff0044',
    product_arrows_color: '#ff0055',
    minimum_purchase: '10.50',
    delivery_message: 'About a pretty message',
    is_featured: false,
    is_guest_enabled_to_buy: false
  }

  let expected = {
    item: {
      ...body
    }
  }

  let endpoint = `${URI}/api/partner`

  let response = await service.post(endpoint, body)

  // ignore date fields
  response.data.data.item = _.omit(response.data.data.item, ['id', 'created_at', 'updated_at', 'archived_at'])

  expect(response.data.data).toEqual(expected)
})

test('it route partner item by id - GET /api/partner/:id - payload', async () => {
  // Get ultimes item created
  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  UltimateElement = _.omit(UltimateElement, ['created_at', 'updated_at'])

  let expected = {
    item: {
      ...UltimateElement
    }
  }

  let endpoint = `${URI}/api/partner/${UltimateElement.id}`

  let response = await service.get(endpoint)

  // ignore date fields
  response.data.data.item = _.omit(response.data.data.item, ['created_at', 'updated_at'])

  expect(response.data.data).toEqual(expected)
})

test('it route partner items - GET /api/partner - payload', async () => {
  let endpoint = `${URI}/api/partner`
  let response = await service.get(endpoint)
  let isArray = response.data.data.items.length
  let val = false

  if (isArray > 0) {
    val = true
  }

  expect(val).toBe(true)
})

test('it route update partner item by id - PUT /api/partner/:id - payload', async () => {
  let body = {
    name_slugify: 'cromlu3',
    logo: '/something.AAA',
    name: 'cromlu sac',
    background_color: '#ff0011',
    product_add_button_color: '#ff0022',
    cart_button_color: '#ff0033',
    product_info_color: '#ff0044',
    product_arrows_color: '#ff0055',
    minimum_purchase: '10.50',
    delivery_message: 'About a pretty message',
    is_featured: false,
    is_guest_enabled_to_buy: false
  }

  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  UltimateElement = _.omit(UltimateElement, ['created_at', 'updated_at'])

  let expected = {
    item: {
      ...UltimateElement
    }
  }

  let endpoint = `${URI}/api/partner/${UltimateElement.id}?_method=put`

  let response = await service.post(endpoint, body)

  // ignore date fields
  response.data.data.item = _.omit(response.data.data.item, ['created_at', 'updated_at'])

  expect(response.data.data).toEqual(expected)
})

test('it route update partner item by id - PATCH /api/partner/:id - payload', async () => {
  let body = {
    name_slugify: 'cromlu3',
    logo: '/something.AAA',
    name: 'cromlu sac',
    background_color: '#ff0011',
    product_add_button_color: '#ff0022',
    cart_button_color: '#ff0033',
    product_info_color: '#ff0044',
    product_arrows_color: '#ff0055',
    minimum_purchase: '10.50',
    delivery_message: 'About a pretty message',
    is_featured: false,
    is_guest_enabled_to_buy: false
  }

  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  UltimateElement = _.omit(UltimateElement, ['created_at', 'updated_at'])

  let expected = {
    item: {
      ...UltimateElement
    }
  }

  let endpoint = `${URI}/api/partner/${UltimateElement.id}?_method=patch`

  let response = await service.post(endpoint, body)

  // ignore date fields
  response.data.data.item = _.omit(response.data.data.item, ['created_at', 'updated_at'])

  expect(response.data.data).toEqual(expected)
})

test('it route delete partner item by id - DELETE /api/partner/:id - payload', async () => {
  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let expected = {
    id: UltimateElement.id
  }
  let endpoint = `${URI}/api/partner/${UltimateElement.id}?_method=delete`
  let response = await service.post(endpoint)
  expect(response.data.data).toEqual(expected)
})
