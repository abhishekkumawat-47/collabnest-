import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
    const users = await prisma.user.createMany({
        data: {
            username: 'C00LC0DER',
            name: 'Arpit Raj',
            roll: '2301EC07',
            email: 'arpit_2301ec07@iitp.ac.in',
            password: 'password',
            role: 'USER',
            rating: 0,
            degree: 'B.Tech',
            year: '2023',
            department: 'Electrical Engineering',
        },
    });

    console.log(users);
}

main().catch((e) => console.error(e));
