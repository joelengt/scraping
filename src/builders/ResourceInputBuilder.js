// import _ from 'lodash'
//
// export default class ResourceInputBuilder {
//   constructor ({entity, attributes, createFields, updateFields, deleteFields}) {
//
//     _.assign(createFields, attributes)
//     _.assign(updateFields, attributes)
//     _.assign(deleteFields, attributes)
//
//     new GraphQLInputObjectType({
//       name: 'UserInput',
//       fields: {
//         name: {
//           type: new GraphQLNonNull(GraphQLString)
//         },
//         last_name: {
//           type: new GraphQLNonNull(GraphQLString)
//         },
//         email: {
//           type: new GraphQLNonNull(GraphQLString)
//         },
//         password: {
//           type: GraphQLString
//         },
//         phone: {
//           type: new GraphQLNonNull(GraphQLFloat)
//         },
//         business_name: {
//           type: new GraphQLNonNull(GraphQLString)
//         },
//         provider: {
//           type: new GraphQLNonNull(GraphQLString)
//         },
//         business_type_id: {
//           type: new GraphQLNonNull(GraphQLID)
//         }
//       }
//     })
//
//   }
// }
