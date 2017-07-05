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
test('it route create new ads item - POST /ads', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let expected = {
    item: {
      ...body
    }
  }

  let partnerID = 1
  let endpoint = `${URI}/api/ads/partner/${partnerID}`

  let response = await service.post(endpoint, body)

  // ignore date fields
  response.data.data.item = _.pick(response.data.data.item, ['name', 'link', 'photo'])

  expect(response.data.data).toEqual(expected)
})

test('it route ads item by id - GET /ads/:id', async () => {
  // Get ultimes item created
  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  UltimateElement = _.pick(UltimateElement, ['id', 'name', 'link', 'photo'])

  let expected = {
    item: {
      ...UltimateElement
    }
  }

  let partnerID = 1
  let endpoint = `${URI}/api/ads/${UltimateElement.id}/partner/${partnerID}`

  let response = await service.get(endpoint)

  // ignore date fields
  response.data.data.item = _.pick(response.data.data.item, ['id', 'name', 'link', 'photo'])

  expect(response.data.data).toEqual(expected)
})

test('it route ads items - GET /ads', async () => {
  let partnerID = 1
  let endpoint = `${URI}/api/ads/partner/${partnerID}`
  let response = await service.get(endpoint)
  let isArray = response.data.data.items.length
  let val = false

  if (isArray > 0) {
    val = true
  }

  expect(val).toBe(true)
})

test('it route update ads item by id - PUT /ads/:id', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  UltimateElement = _.pick(UltimateElement, ['id', 'name', 'link', 'photo'])

  let expected = {
    item: {
      ...UltimateElement
    }
  }

  let partnerID = 1
  let endpoint = `${URI}/api/ads/${UltimateElement.id}/partner/${partnerID}?_method=put`

  let response = await service.post(endpoint, body)

  // ignore date fields
  response.data.data.item = _.pick(response.data.data.item, ['id', 'name', 'link', 'photo'])

  expect(response.data.data).toEqual(expected)
})

test('it route delete ads item by id - DELETE /ads/:id', async () => {
  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let expected = {
    id: UltimateElement.id
  }
  let partnerID = 1
  let endpoint = `${URI}/api/ads/${UltimateElement.id}/partner/${partnerID}?_method=delete`
  let response = await service.post(endpoint)
  expect(response.data.data).toEqual(expected)
})
