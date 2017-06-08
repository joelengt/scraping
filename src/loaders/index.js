import categories from './categories'
import product from './product'
import productCategory from './product-category'
import purchaseItem from './purchase-item'
import purchaseStatus from './purchase-status'
import users from './users'
import node from './node'

export default () => ({
  categories,
  product: product(),
  productCategory,
  purchaseItem: purchaseItem(),
  purchaseStatus: purchaseStatus(),
  node: node(),
  users: users()
})
