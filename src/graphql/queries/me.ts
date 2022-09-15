import { PrismaUser } from '@prisma/client'
import { User } from '../../../generated/graphql'

export async function me({ id, email, firstName, lastName, username }: PrismaUser): Promise<User> {
    return { id, email, firstName, lastName, username }
}
