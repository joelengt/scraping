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
test('it route create new ads item - POST /ads - statusCode 201', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let partnerID = 1
  let endpoint = `${URI}/api/ads/partner/${partnerID}`

  let response = await service.post(endpoint, body)
  expect(response.status).toBe(201)
})

test('it route ads item by id - GET /ads/:id - statusCode 200', async () => {
  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let partnerId = 1
  let endpoint = `${URI}/api/ads/${UltimateElement.id}/partner/${partnerId}`
  let response = await service.get(endpoint)
  expect(response.status).toBe(200)
})

test('it route ads items - GET /ads - statusCode 200', async () => {
  let partnerID = 1
  let endpoint = `${URI}/api/ads/partner/${partnerID}`
  let response = await service.get(endpoint)
  expect(response.status).toBe(200)
})

test('it route update ads item by id - PUT /ads/:id - statusCode 200', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let partnerID = 1
  let endpoint = `${URI}/api/ads/${UltimateElement.id}/partner/${partnerID}?_method=put`

  let response = await service.post(endpoint, body)
  expect(response.status).toBe(200)
})

test('it route delete ads item by id - DELETE /ads/:id - statusCode 200', async () => {
  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let partnerID = 1
  let endpoint = `${URI}/api/ads/${UltimateElement.id}/partner/${partnerID}?_method=delete`

  let response = await service.post(endpoint)
  expect(response.status).toBe(200)
})
