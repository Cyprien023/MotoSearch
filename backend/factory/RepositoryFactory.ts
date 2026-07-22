import { PrismaClient } from "@prisma/client";

import { IMotoRepository } from "../Repository/IMotoRepository";
import { MotoRepository } from "../Repository/MotoRepository";
import { MockMotoRepository } from "../Repository/MockMotoRepository";

export class RepositoryFactory {

    static createMotoRepository(
        prisma: PrismaClient
    ): IMotoRepository {

        if (process.env.DATA_SOURCE === "db") {
            return new MotoRepository(prisma);
        }

        return new MockMotoRepository();
    }
}