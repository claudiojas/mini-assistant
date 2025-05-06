import { prisma } from "../BD/prisma.config";
import { Classification } from "@prisma/client";
import { IFindSimilarQuestion, IMethodsRepository, ISaveToDatabase } from "../interfaces/interfaces";

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
                question: {
                    contains: data.question,
                },
            },
            orderBy: {
                createdAt: 'desc', // Ordena por data, retornando a mais recente primeiro
            },
            take: 1, // Retorna apenas o primeiro resultado
        });
        
        return result.length > 0 ? result[0] : null;
    };
}