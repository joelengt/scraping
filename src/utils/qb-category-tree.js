import sql from '../connectors'

let query = 'category as item on item.id = cr.parent_id'

let join = sql
  .raw(`category_relation as cr inner join ${query}`)
  .wrap('(', ')')

export const QBCategoryTree = sql('product_category as pc')
  .select([
    'pc.product_id as product_id',
    'category.name as subCategory',
    'item.name as category'
  ])
  .innerJoin('category', qb => {
    qb.on('category.id', 'pc.category_id')
  })
  .leftOuterJoin(join, qb => {
    qb.on('category.id', 'cr.child_id')
  })
  .groupBy('pc.product_id')
  .as('tree')
