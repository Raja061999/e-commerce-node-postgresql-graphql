// graphql/typeDefs.js
import gql from 'graphql-tag';

export const typeDefs = gql`
  enum Role {
    ADMIN
    CUSTOMER
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    createdAt: String
    updatedAt: String
  }

  type Product {
  id: String!
  name: String!
  description: String!
  price: Float!
  inventory: Int!
  categoryId: String!
  createdAt: String!
  updatedAt: String!
}

type Order {
  id: ID!
  user: User!
  total: Float!
  status: String!
  orderItems: [OrderItem!]!
  createdAt: String!
}

type OrderItem {
  id: ID!
  product: Product!
  quantity: Int!
  price: Float!
}


  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
  me: User
  categories: [Category!]!
  category(id: ID!): Category
  products: [Product!]!
  product(id: ID!): Product
  orders: [Order!]!
  order(id: ID!): Order
}


  input OrderItemInput {
  productId: ID!
  quantity: Int!
}

input CreateOrderInput {
  items: [OrderItemInput!]!
}

  type Mutation {
    register(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!
    createCategory(name: String!, description: String): Category
    createProduct(name: String!, description: String!, price: Float!, inventory: Int!, categoryId: String!): Product!
    createOrder(data: CreateOrderInput!): Order!
  }
`;
