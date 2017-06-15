// Test Rotues api
require('dotenv').config()

var axios = require('axios')

var service = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

let URI = 'http://' + process.env.HOST + ':' + process.env.PORT

test('it route create new ads item - POST /api/ads', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }
  let response = await service.post(URI + '/api/ads', body)
  expect(response.data).toMatchSnapshot()
})

test('it route ads item by id - GET /api/ads/:id', async () => {
  // Get ultimes item created
  let response = await service.get(URI + '/api/ads/11')
  expect(response.data).toMatchSnapshot()
})

test('it route ads items - GET /api/ads', async () => {
  let response = await service.get(URI + '/api/ads')
  expect(response.data).toMatchSnapshot()
})

test('it route update ads item by id - PUT /api/ads/:id', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }
  let response = await service.post(URI + '/api/ads/11?_method=put', body)
  expect(response.data).toMatchSnapshot()
})

test('it route delete ads item by id - DELETE /api/ads/:id', async () => {
  let response = await service.post(URI + '/api/ads/35?_method=delete')
  expect(response.data).toMatchSnapshot()
})
