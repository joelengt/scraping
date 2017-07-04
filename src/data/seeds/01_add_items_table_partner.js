exports.seed = (knex, Promise) => {
  return knex('partner')
  .del()
  .then(() => {
    return knex('partner').insert([
      {
        name: 'P&G',
        name_slugify: 'Procter-y-Gamble',
        logo: 'https://res.cloudinary.com/riqra/image/upload/v1496525749/web/riqra-partner-logo.png',
        background_color: '#00bbff',
        product_add_button_color: '#00bb11',
        cart_button_color: '#11bbaa',
        product_info_color: '#00bbff',
        product_arrows_color: '#00bbff',
        minimum_purchase: 120.00,
        delivery_message: 'Entrega en 48 horas',
        is_featured: true,
        is_guest_enabled_to_buy: false
      },
      {
        name: 'laive',
        name_slugify: 'laive',
        logo: 'https://res.cloudinary.com/riqra/image/upload/v1496525749/web/riqra-partner-logo.png',
        background_color: '#005497',
        product_add_button_color: '#00bb11',
        cart_button_color: '#11bbaa',
        product_info_color: '#00bbff',
        product_arrows_color: '#00bbff',
        minimum_purchase: 80.00,
        delivery_message: 'Entrega en 48 horas',
        is_featured: true
      },
      {
        name: 'Coca Cola',
        name_slugify: 'coca-cola',
        logo: 'https://res.cloudinary.com/riqra/image/upload/v1496525749/web/riqra-partner-logo.png',
        background_color: '#115497',
        product_add_button_color: '#00bb11',
        cart_button_color: '#11bbaa',
        product_info_color: '#00bbff',
        product_arrows_color: '#00bbff',
        minimum_purchase: 100.00,
        delivery_message: 'Entrega en 40 horas',
        is_featured: true
      },
      {
        name: 'Helados Nestle',
        name_slugify: 'Nestle-helados',
        logo: 'https://res.cloudinary.com/riqra/image/upload/v1496525749/web/riqra-partner-logo.png',
        background_color: '#225497',
        product_add_button_color: '#00bb11',
        cart_button_color: '#00bbaa',
        product_info_color: '#00bbff',
        product_arrows_color: '#00bbff',
        minimum_purchase: 150.00,
        delivery_message: 'Entrega en 48 horas',
        is_featured: true,
        is_guest_enabled_to_buy: false
      }
    ])
  })
}
