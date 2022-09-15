import { authenticate } from '../lib/auth.lib'
import { Resolvers } from '../../generated/graphql'
import { resolverFn } from './graphql.lib'
import { login } from './mutations/login'
import { me } from './queries/me'
import { registerUser } from "./mutations/registerUser";

export const resolvers: Resolvers = {
    Query: {
        me: resolverFn(({ context }) => me(authenticate(context))),
    },
    Mutation: {
        login: resolverFn(({ input }) => login(input)),
        registerUser: resolverFn(({ input }) => registerUser(input)),
    },
}
