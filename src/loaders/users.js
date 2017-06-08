import connector from './../connectors/'
import DataLoader from 'dataloader'

export default () => new DataLoader(ids => {
  return connector('client')
  .whereIn('id', ids)
  .orderByRaw('FIELD(client.id, ?)', [ids])
})
