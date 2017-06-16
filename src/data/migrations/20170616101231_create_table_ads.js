exports.up = (knex, Promise) => {
  return knex.schema.createTable('ads', (table) => {
    table.increments('id')
    table.string('name').notNullable()
    table.string('photo').notNullable()
    table.string('link').notNullable()
    table.timestamps(false, true)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('ads')
}
