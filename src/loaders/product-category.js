import connector from './../connectors/'
import DataLoader from 'dataloader'
import _ from 'lodash'

export default new DataLoader(ids => {
  return connector('product_category as pc')
  .innerJoin('category', function () {
    this.on('category.id', 'pc.category_id')
  })
  .whereIn('pc.product_id', ids)
  .then((data) => {
    data = _.groupBy(data, 'product_id')
    return _.map(ids, id => data[id])
  })
})
