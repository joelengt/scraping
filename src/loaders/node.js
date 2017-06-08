import sql from './../connectors/'
import DataLoader from 'dataloader'
import snakeCase from 'snake-case'

export default () => new DataLoader(keys => {
  return Promise.all(keys.map(key => {
    let [type, id] = key
    let name = snakeCase(type)

    if (isNaN(id)) {
      return new Error(`ID malformed`)
    }

    if (name === 'user') {
      name = 'client'
    }

    return sql(name)
    .where('id', id)
    .limit(1)
    .spread(entity => {
      if (!entity) {
        throw new Error(`Entity with normal id ${id} doesn't exist`)
      }

      entity._type = type
      return entity
    })
  }))
})
