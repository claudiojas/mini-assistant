import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const historyText = `
    Digital Pro: Plataforma que compartilha padrões de desenvolvimento e conhecimento gratuito. É um sonho que pretendo realizar para o futuro, retribuir o conhecimento que eu conseguir acumular.

    Projeto de IA para monitoramento de consumo: Sistema que usa Google Gemini para interpretar dados de medidores de água e gás e salvar em banco de dados.

    Aplicativo de Geolocalização: Integração com Google Maps API para conectar motoristas e passageiros, similar ao Uber.

    Instituto Mãos Unidas (voluntário): E-commerce com Next.js, React e Tailwind CSS para vendas de produtos feitos por mulheres apoiadas pelo Instituto, com integração à API do Yampi.

    Se fizer sentido, você pode mencionar que todos os projetos foram focados em acessibilidade, performance, segurança e boas práticas de código.

    Pode também adaptar a resposta conforme o tipo de projeto que a pessoa busca (ex: e-commerce, app com mapa, projeto com IA, low-code etc).

    Importante: Nunca responda com um texto longo ou muito técnico. Fale com naturalidade, como um bate-papo entre colegas. Se possível, inclua toques leves de entusiasmo, como “foi bem legal de desenvolver”, “esse projeto me ensinou muito sobre X”, etc.
`;

const contentMessage = `
    Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack.
    Responda como se fosse o próprio Cláudio, de forma breve, amigável e natural, mas não precisa responder
    como se fosse o primeiro contato do dia com expressões como: "olá..". Responda como se estivesse conversando com alguém no chat.
`;

export async function projectsAgent(task: string, recentHistory: ChatEntry[]) {
  // Formatar o histórico recente para incluir no prompt
  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  const prompt = `
    Quando te perguntarem sobre projetos, use como base essas informações: ${historyText}
    Contexto recente:
    ${recentQuestionsAndAnswers}
    Tarefa: "${task}"
  `;

  try {
    const response = await fetch(process.env.GROQ_API_URL || "", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: contentMessage
          },
          {
            role: 'user',
            content: prompt,
          },
        ]
      })
    });

    const data = await response.json();
    const choice = data?.choices?.[0]?.message?.content?.trim();
    if (!choice) {
      throw new Error("Resposta inválida da LLM.");
    }
    return choice;
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    return "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?";
  }
}
