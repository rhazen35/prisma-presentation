import { PrismaUser } from "@prisma/client"
import { isRecord } from "./common.lib"

export function isPrismaUser(context: unknown): context is PrismaUser {
    return isRecord(context)
        && typeof context.id === 'string'
        && typeof context.username === 'string'
        && typeof context.password === 'string'
        && typeof context.email === 'string'
        && typeof context.firstName === 'string'
        && typeof context.lastName === 'string'
        && typeof context.createdAt === 'object'
        && typeof context.updatedAt === 'object'
}
