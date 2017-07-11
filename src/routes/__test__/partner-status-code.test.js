// Test Rotues
import {noop} from '../../utils'

require('dotenv').config()
var sql = require('../../initializers/knex')
var axios = require('axios')

var service = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

let URI = 'http://' + process.env.HOST + ':' + process.env.PORT

// Testing Status Code
test('it route create new partner item - POST /api/partner - statusCode 201', async () => {
  let body = {
    name_slugify: 'cromlu3',
    logo: '/something.AAA',
    name: 'cromlu sac'
  }

  let endpoint = `${URI}/api/partner`

  let response = await service.post(endpoint, body)
  expect(response.status).toBe(201)
})

test('it route partner item by id - GET /api/partner/:id - statusCode 200', async () => {
  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let endpoint = `${URI}/api/partner/${UltimateElement.id}`
  let response = await service.get(endpoint)
  expect(response.status).toBe(200)
})

test('it route partner items - GET /api/partner - statusCode 200', async () => {
  let endpoint = `${URI}/api/partner`
  let response = await service.get(endpoint)
  expect(response.status).toBe(200)
})

test('it route update partner item by id - PUT /partner/:id - statusCode 200', async () => {
  let body = {
    name_slugify: 'cromlu3',
    logo: '/something.AAA',
    name: 'cromlu sac'
  }

  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let endpoint = `${URI}/api/partner/${UltimateElement.id}?_method=put`

  let response = await service.post(endpoint, body)
  expect(response.status).toBe(200)
})

test('it route update partner item by id - PATCH /partner/:id - statusCode 200', async () => {
  let body = {
    name_slugify: 'cromlu3',
    logo: '/something.AAA',
    name: 'cromlu sac'
  }

  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let endpoint = `${URI}/api/partner/${UltimateElement.id}?_method=patch`

  let response = await service.post(endpoint, body)
  expect(response.status).toBe(200)
})

test('it route delete partner item by id - DELETE /partner/:id - statusCode 200', async () => {
  let UltimateElement = await sql('partner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let endpoint = `${URI}/api/partner/${UltimateElement.id}?_method=delete`

  let response = await service.post(endpoint)
  expect(response.status).toBe(200)
})
