import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil.
  Responda com naturalidade, simpatia e leveza. 
  Você está conversando por um chat, então use uma linguagem informal, como em uma conversa entre colegas.
  Se a pessoa perguntar algo que você não lembra (ex: nome dela), seja gentil e diga que não consegue lembrar agora.
`;

export async function memoryAgent(task: string, recentHistory: ChatEntry[]) {

  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  
  const prompt = `
    A pessoa perguntou algo pessoal ou relacionado ao contexto da conversa. 
    Responda de maneira amigável, como se fosse Cláudio, mantendo o tom leve e próximo.
    
    Exemplo de temas: 
    - “Você lembra meu nome?”
    - “Eu já falei isso antes?”
    - “Eu sou o João, lembra de mim?”
    - “Lembra do  projeto que a gente conversou?”

    Tarefa: "${task}"
    Contexto recente:c${recentQuestionsAndAnswers}
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
            content: contentMessage,
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
    return "Poxa, não lembro exatamente agora 😅, mas se você puder me lembrar, fico feliz!";
  }
}
