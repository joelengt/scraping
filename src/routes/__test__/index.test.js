// Test Rotues api
import {noop} from '../../utils'
require('dotenv').config()
var sql = require('../../initializers/knex')
var axios = require('axios')

var service = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

let URI = 'http://' + process.env.HOST + ':' + process.env.PORT

// Testing Status Code
test('it route create new ads item - POST /api/ads - statusCode 201', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let response = await service.post(`${URI}/api/ads`, body)
  expect(response.status).toBe(201)
})

test('it route ads item by id - GET /api/ads/:id - statusCode 200', async () => {
  let UltimateElement = await sql('banner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.get(`${URI}/api/ads/${UltimateElement.id}`)
  expect(response.status).toBe(200)
})

test('it route ads items - GET /api/ads - statusCode 200', async () => {
  let response = await service.get(`${URI}/api/ads`)
  expect(response.status).toBe(200)
})

test('it route update ads item by id - PUT /api/ads/:id - statusCode 200', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let UltimateElement = await sql('banner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.post(`${URI}/api/ads/${UltimateElement.id}?_method=put`, body)
  expect(response.status).toBe(200)
})

test('it route delete ads item by id - DELETE /api/ads/:id - statusCode 200', async () => {
  let UltimateElement = await sql('banner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.post(`${URI}/api/ads/${UltimateElement.id}?_method=delete`)
  expect(response.status).toBe(200)
})

// Testing response json
test('it route create new ads item - POST /api/ads', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let response = await service.post(`${URI}/api/ads`, body)
  expect(response.data).toMatchSnapshot()
})

test('it route ads item by id - GET /api/ads/:id', async () => {
  // Get ultimes item created
  let UltimateElement = await sql('banner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.get(`${URI}/api/ads/${UltimateElement.id}`)
  expect(response.data).toMatchSnapshot()
})

test('it route ads items - GET /api/ads', async () => {
  let response = await service.get(`${URI}/api/ads`)
  expect(response.data).toMatchSnapshot()
})

test('it route update ads item by id - PUT /api/ads/:id', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }

  let UltimateElement = await sql('banner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.post(`${URI}/api/ads/${UltimateElement.id}?_method=put`, body)
  expect(response.data).toMatchSnapshot()
})

test('it route delete ads item by id - DELETE /api/ads/:id', async () => {
  let UltimateElement = await sql('banner')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.post(`${URI}/api/ads/${UltimateElement.id}?_method=delete`)
  expect(response.data).toMatchSnapshot()
})
