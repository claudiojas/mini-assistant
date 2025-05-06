import { Classification } from "@prisma/client";

export interface ISaveToDatabase {
    question: string, 
    response: string
}

export interface IFindSimilarQuestion {
    question: string;
}

export interface IMethodsRepository {
    saveToDatabase(data:ISaveToDatabase): Promise<Classification>;
    findSimilarQuestion(data: IFindSimilarQuestion): Promise<Classification | null>;
}