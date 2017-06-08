import connector from './../connectors/'
import DataLoader from 'dataloader'

export default () => new DataLoader(ids => {
  return connector('purchase_status as ps')
  .innerJoin('purchase', function () {
    this.on('purchase.purchase_status_id', 'ps.id')
  })
  .whereIn('purchase.id', ids)
  .orderByRaw('FIELD(purchase.id, ?)', [ids])
})
