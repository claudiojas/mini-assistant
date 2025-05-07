import { Classification } from "@prisma/client";
import { IFindSimilarQuestion, IMethodsRepository, ISaveToDatabase } from "../interfaces/interfaces";
import { prisma } from "../DB/prisma.config";

export class MethodsRepository implements IMethodsRepository {
    async saveToDatabase(data: ISaveToDatabase): Promise<Classification> {
        return await prisma.classification.create({
            data: {
                question: data.question,
                response: data.response,
            },
        });
    }
    async findSimilarQuestion(data: IFindSimilarQuestion): Promise<Classification | null> {
        const result = await prisma.classification.findMany({
            where: {
              question: data.question,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
        });
        
        return result.length > 0 ? result[0] : null;
    };
}