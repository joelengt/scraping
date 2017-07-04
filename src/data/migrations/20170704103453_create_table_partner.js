exports.up = (knex, Promise) => {
  return knex.schema.createTable('partner', (table) => {
    table.increments('id')

    table.string('name').notNullable()
    table.string('name_slugify').notNullable()
    table.string('logo').notNullable()
    table.string('background_color')
    table.string('product_add_button_color')
    table.string('cart_button_color')
    table.string('product_info_color')
    table.string('product_arrows_color')
    table.decimal('minimum_purchase', 10, 2)
    table.string('delivery_message')
    table.boolean('is_featured').defaultTo(false)
    table.boolean('is_guest_enabled_to_buy').defaultTo(true)

    table.timestamps(false, true)
    table.datetime('archived_at')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('partners')
}
