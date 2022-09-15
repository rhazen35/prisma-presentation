import { ApolloError } from 'apollo-server'
import * as bcrypt from 'bcrypt'
import { addYears } from 'date-fns'
import { AccessToken, MutationLoginArgs } from "../../../generated/graphql"
import { prisma } from '../../../prisma/prisma'

export async function login({ email, password }: MutationLoginArgs): Promise<AccessToken> {
    const user = await prisma.prismaUser.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new ApolloError('Invalid credentials.', '403')
    }

    if (!user.password) {
        throw new ApolloError('Please setup a password first.', '403')
    }
    
    if (!await bcrypt.compare(password, user.password)) {
        throw new ApolloError('Invalid credentials.', '403')
    }

    let accessToken = await prisma.prismaAccessToken.findFirst({
        where: {
            user: {
                id: user.id
            }
        },
        orderBy: {
            expiresAt: 'desc'
        }
    })
    

    if (!accessToken) {
        const { id } = await generateNewAccessToken(user.id)
        return { token: id }
    }

    if (accessToken.expiresAt < new Date()) {
        accessToken = await generateNewAccessToken(user.id)
    }

    return { token: accessToken.id }
}

function generateNewAccessToken(userId: string) {
    return prisma.prismaAccessToken.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            expiresAt: addYears(new Date(), 1)
        }
    })
}
