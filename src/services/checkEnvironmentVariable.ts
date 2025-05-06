export const checkEnvironmentVariable = () => {
    if (!process.env.GROQ_API_URL || !process.env.GROQ_API_KEY) {
        throw new Error("Variáveis de ambiente não configuradas corretamente.");
    }
}