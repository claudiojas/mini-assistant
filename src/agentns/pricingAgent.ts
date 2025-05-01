import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil.
  Fale sobre preços e formas de pagamento com clareza e empatia, de forma informal e direta.
`;

export async function pricingAgent(task: string, recentHistory: ChatEntry[]) {

  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");


  const prompt = `
    A pessoa está perguntando sobre valores, orçamentos, formas de cobrança ou pagamento.
    Explique que você trabalha com projeto fechado ou por hora (quando for o caso), com entrada e finalização, e pode negociar conforme o projeto.

    Tarefa: "${task}"

    Contexto recente: ${recentQuestionsAndAnswers}
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
    console.error("Erro ao chamar o pricingAgent:", error);
    return "Claro! Posso fazer um orçamento com base no que você precisar. Me conta mais sobre o projeto?";
  }
}
