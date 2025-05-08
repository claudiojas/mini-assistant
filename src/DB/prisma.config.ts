import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient()


async function connect() {
    try {
      const result = await prisma.$connect();
      console.log("✅ Conectado ao banco de dados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao conectar no banco de dados:", error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  connect();