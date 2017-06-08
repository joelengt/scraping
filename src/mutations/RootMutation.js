import {
  GraphQLObjectType
} from 'graphql/type'

import Purchase from './Purchase'
import User from './User'
import Address from './Address'
import PurchaseStatus from './PurchaseStatus'
import RUC from './RUC'
import PickList from './PickList'
import Guide from './Guide'
import Export from './Export'
import Bill from './Bill'
import Login from './Login'
import Product from './Product'
import Brand from './Brand'
import Category from './Category'
import S3Signature from './S3Signature'
import PurchaseDeliveryDate from './PurchaseDeliveryDate'
import GoodsBatch from './GoodsBatch'
import Import from './Import'
import Banner from './Banner'
import BusinessPartner from './BusinessPartner'

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    ...Purchase,
    ...Address,
    ...User,
    ...S3Signature,
    ...GoodsBatch,
    ...Product,
    ...Brand,
    ...Category,
    ...PurchaseStatus,
    ...Banner,
    ...PurchaseDeliveryDate,
    ...BusinessPartner,
    ruc: RUC,
    bill: Bill,
    picklist: PickList,
    guide: Guide,
    export: Export,
    import: Import,
    login: Login
  }
})

export default RootMutation
