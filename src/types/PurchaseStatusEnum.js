import {
  GraphQLEnumType
} from 'graphql'

export const PurchaseStatusEnum = new GraphQLEnumType({
  name: 'PurchaseStatusEnum',
  values: {
    REGISTERED: {
      description: 'Se registró pedido por primera vez (automatico)',
      value: 1
    },
    VALIDATED: {
      description: 'Se registró pedido por 2da vez en adelante (semi-automatico)',
      value: 2
    },
    PROGRAMMED: {
      description: 'Se tiene fecha de entrega (automatico)',
      value: 3
    },
    IN_ROUTE: {
      description: 'El pedido está en el camión',
      value: 4
    },
    BOUNCED: {
      description: 'El pedido no se logró entregar',
      value: 5
    },
    COMPLETED: {
      description: 'El pedido se entregó satisfactoriamente',
      value: 6
    },
    BILLED: {
      description: 'Se emitió el recibo del pedido',
      value: 7
    },
    CANCELLED: {
      description: 'Cuando el cliente cancela el pedido',
      value: 8
    }
  }
})
