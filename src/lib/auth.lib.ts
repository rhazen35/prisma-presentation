import { PrismaUser } from '@prisma/client'
import { ApolloError } from 'apollo-server'
import { Request } from "express"
import { User } from "../../generated/graphql"
import { prisma } from "../../prisma/prisma"
import { Context } from '../types/common.types'
import { isPrismaUser } from './user.lib'

/**
 * Attempts to find user for Authorization header (AccessToken).
 */
export async function findUserForToken(req: Request): Promise<User | null> {
    return prisma.prismaAccessToken.findFirst({
        where: { 
            id: req.headers.authorization || '',
            expiresAt: { gte: new Date() }
         },
        orderBy: {
            createdAt: 'desc',
        },
    })
        .then((token) => prisma.prismaUser.findFirst({ where: { id: token!.userId } }))
        .catch(() => null)
}

export function authenticate(context: Context): PrismaUser {
    if (!isPrismaUser(context)) {
        throw new ApolloError('Unauthenticated', '403')
    }

    return context
}
