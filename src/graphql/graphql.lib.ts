import { GraphQLResolveInfo } from "graphql"
import { ResolverFn } from "../../generated/graphql"

export interface ResolverArgs<TInput, TContext, TParent> {
    input: TInput
    context: TContext
    parent: TParent
    info: GraphQLResolveInfo
}

export function resolverFn<
    TInput, 
    TResult, 
    TContext = {}, 
    TParent = {},
>(
    fn: (args: ResolverArgs<TInput, TContext, TParent>) => TResult,
): ResolverFn<TResult, TParent, TContext, TInput> {
    return (parent, input, context, info) => {
        return fn({ 
            parent, 
            input, 
            context, 
            info,
        })
    }
}
