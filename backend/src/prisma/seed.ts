import { PrismaClient } from '@prisma/client';
import { mockMoto } from '../Data/MockMoto';

const prisma = new PrismaClient();

async function main() {
    console.log(`Seed de ${mockMoto.length} motos...`);

    await prisma.moto.deleteMany();

    for (const moto of mockMoto) {
        await prisma.moto.create({
            data: {
                ...moto,
                datePublication: new Date(moto.datePublication),
            },
        });
    }

    console.log('Seed terminé.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });