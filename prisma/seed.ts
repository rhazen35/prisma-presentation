import * as bcrypt from 'bcrypt'
import { addYears } from 'date-fns'
import { prisma } from "./prisma"

void seed()

async function seed() {
    await prisma.prismaUser.deleteMany({})

    const defaultPassword = bcrypt.hashSync('password', 10)

    const users = [
        {
            email: 'max-verstappen@company.com',
            username: 'max33',
            password: defaultPassword,
            firstName: 'Max',
            lastName: 'Verstappen',
            accessToken: {
                create: { id: '1', expiresAt: addYears(new Date(), 1), }
            }
        },
        {
            email: 'charles-leclerc@company.com',
            username: 'charles',
            password: defaultPassword,
            firstName: 'Charles',
            lastName: 'Leclerc',
            accessToken: {
                create: { id: '2', expiresAt: addYears(new Date(), 1), }
            }
        },
        {
            email: 'yuki-tsunoda@company.com',
            username: 'yuki',
            password: defaultPassword,
            firstName: 'Yuki',
            lastName: 'Tsunoda',
            accessToken: {
                create: { id: '3', expiresAt: addYears(new Date(), 1), }
            }
        }
    ]

    await Promise.all(
        users.map((data) => prisma.prismaUser.create({ data }))
    )
}
