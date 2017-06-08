import connector from './../connectors/'
import DataLoader from 'dataloader'

export default new DataLoader(ids => {
  return connector('category_relation as cr')
  .select('category.*')
  .innerJoin('category', function () {
    this.on('cr.parent_id', 'category.id')
  })
  .whereIn('cr.child_id', ids)
  .orderByRaw('FIELD(cr.child_id, ?)', [ids])
})
