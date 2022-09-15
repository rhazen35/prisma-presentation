import { ApolloError } from 'apollo-server'
import { addYears } from 'date-fns'
import { MutationRegisterUserArgs, UserRegistration } from "../../../generated/graphql"
import { prisma } from '../../../prisma/prisma'
import * as bcrypt from "bcrypt";
import { PrismaAccessToken, PrismaUser, PrismaUserRegistration } from '@prisma/client';

export async function registerUser(data: MutationRegisterUserArgs): Promise<UserRegistration> {
    const existingUser = await prisma.prismaUser.findUnique({
        where: {
            email: data.email,
        },
    })

    if (existingUser) {
        throw new ApolloError(`A user with email: ${ data.email } already exists`, '400')
    }

    const user = await createUser(data)
    const confirmationToken = await generateNewConfirmationToken(user.id)

    await createPrismaUserRegistration(user, confirmationToken)

    return createUserRegistration(user, confirmationToken)
}

function createUser({ email, firstName, lastName, password, username }: MutationRegisterUserArgs): Promise<PrismaUser> {
    const encryptedPassword = bcrypt.hashSync(password, 10)

    return prisma.prismaUser.create({
        data: {
            email: email,
            password: encryptedPassword,
            username: username,
            firstName: firstName,
            lastName: lastName,
            accessToken: {
                create: { expiresAt: addYears(new Date(), 1), },
            },
        },
    })
}

function createPrismaUserRegistration(
    user: PrismaUser, 
    confirmationToken: PrismaAccessToken,
): Promise<PrismaUserRegistration> {
    return prisma.prismaUserRegistration.create({
        data: {
            user: {
                connect: {
                    id: user.id,
                },
            },
            confirmationToken: {
                connect: {
                    id: confirmationToken.id,
                },
            },
        },
    })
}

function generateNewConfirmationToken(userId: string): Promise<PrismaAccessToken> {
    return prisma.prismaAccessToken.create({
        data: {
            user: {
                connect: {
                    id: userId,
                },
            },
            expiresAt: addYears(new Date(), 1),
        },
    })
}

function createUserRegistration(
    user: PrismaUser, 
    confirmationToken: PrismaAccessToken,
): UserRegistration {
    return { user, confirmationToken: {token: confirmationToken.id} }
}
