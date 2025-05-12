// index.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { typeDefs } from './src/graphql/typeDefs.js';
// import { resolvers } from './src/graphql/resolvers.js';
import { getUserFromToken } from './src/utils/auth.js';
import { resolvers } from './src/resolvers/index.js';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token.replace('Bearer ', ''));
    return { user };
  },
});

console.log(`🚀 Server ready at ${url}`);
