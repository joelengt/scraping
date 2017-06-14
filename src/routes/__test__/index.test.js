// Test Rotues api
process.env.HOST = '127.0.0.1'
process.env.PORT = 5000

var axios = require('axios')

var service = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

let URI = 'http://' + process.env.HOST + ':' + process.env.PORT

test('it route create new ads item - POST /api/brand', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }
  let response = await service.post(URI + '/api/brand', body)
  expect(response.data).toMatchSnapshot()
})

test('it route ads item by id - GET /api/brand/:id', async () => {
  let response = await service.get(URI + '/api/brand/11')
  expect(response.data).toMatchSnapshot()
})

test('it route ads items - GET /api/brand', async () => {
  let response = await service.get(URI + '/api/brand')
  expect(response.data).toMatchSnapshot()
})

test('it route update ads item by id - PUT /api/brand/:id', async () => {
  let body = {
    name: 'pretty banner',
    link: '/something.png',
    photo: 'http://cdn.image./something.png'
  }
  let response = await service.post(URI + '/api/brand/11?_method=put', body)
  expect(response.data).toMatchSnapshot()
})

test('it route delete ads item by id - DELETE /api/brand/:id', async () => {
  let response = await service.post(URI + '/api/brand/35?_method=delete')
  expect(response.data).toMatchSnapshot()
})
