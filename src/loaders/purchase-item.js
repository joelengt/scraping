import connector from './../connectors'
import DataLoader from 'dataloader'
import _ from 'lodash'

export default () => new DataLoader(ids => {
  return connector('purchase_item as pi')
  .whereIn('pi.purchase_id', ids)
  .then((data) => _.values(_.groupBy(data, 'purchase_id')))
})
