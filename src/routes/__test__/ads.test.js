// Test Rotues
import {noop} from '../../utils'
import _ from 'lodash'

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

  let response = await service.post(`${URI}/ads`, body)
  expect(response.status).toBe(201)
})

test('it route ads item by id - GET /ads/:id - statusCode 200', async () => {
  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.get(`${URI}/ads/${UltimateElement.id}`)
  expect(response.status).toBe(200)
})

test('it route ads items - GET /ads - statusCode 200', async () => {
  let response = await service.get(`${URI}/ads`)
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

  let response = await service.post(`${URI}/ads/${UltimateElement.id}?_method=put`, body)
  expect(response.status).toBe(200)
})

test('it route delete ads item by id - DELETE /ads/:id - statusCode 200', async () => {
  let UltimateElement = await sql('ads')
  .orderBy('id', 'desc')
  .limit(1)
  .spread(noop)

  let response = await service.post(`${URI}/ads/${UltimateElement.id}?_method=delete`)
  expect(response.status).toBe(200)
})

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

  let response = await service.post(`${URI}/ads`, body)

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

  let response = await service.get(`${URI}/ads/${UltimateElement.id}`)

  // ignore date fields
  response.data.data.item = _.pick(response.data.data.item, ['id', 'name', 'link', 'photo'])

  expect(response.data.data).toEqual(expected)
})

test('it route ads items - GET /ads', async () => {
  let response = await service.get(`${URI}/ads`)
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

  let response = await service.post(`${URI}/ads/${UltimateElement.id}?_method=put`, body)

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

  let response = await service.post(`${URI}/ads/${UltimateElement.id}?_method=delete`)
  expect(response.data.data).toEqual(expected)
})
