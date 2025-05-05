export const checkEnvironmentVariable = () => {
    if (!process.env.GROQ_API_URL || !process.env.GROQ_API_KEY) {
        console.error("Variáveis de ambiente não configuradas corretamente.");
        return { message: "Ops! Algo não está certo. Tente novamente mais tarde." };
    }
}