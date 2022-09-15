import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import 'dotenv/config'
import express from 'express'
import { readFileSync } from 'fs'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import path from 'path'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { resolvers } from './graphql/resolvers'
import { findUserForToken } from './lib/auth.lib'

void main()

async function main() {
    const port = 4000
    const app = express()
    const httpServer = createServer(app)

    const typeDefs = readFileSync(path.resolve(__dirname, './graphql/schema.graphql')).toString('utf-8')

    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const server = new ApolloServer({ schema, context: ({ req }) => findUserForToken(req) }) 

    await server.start()

    server.applyMiddleware({ app })

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath },
    )

    httpServer.listen(port, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${port}${server.graphqlPath}`,)
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}${server.graphqlPath}`,)
    })
}
