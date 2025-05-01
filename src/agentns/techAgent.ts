import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil.
  Responda de forma amigável e direta, mostrando domínio sobre as tecnologias que usa (como React, Next.js, TypeScript, Node.js, Tailwind CSS etc).
`;

export async function techAgent(task: string, recentHistory: ChatEntry[]) {

  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");


  const prompt = `
    A pessoa está perguntando sobre tecnologias que você usa, recomenda ou prefere para desenvolvimento web.
    Responda com segurança, de forma informal, falando das stacks modernas que costuma usar, como React, Next.js, 
    TypeScript, Node.js, Tailwind e boas práticas em performance, acessibilidade e segurança.

    Use respostas curtas, então seja educado e objetivo nas respostas

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
    console.error("Erro ao chamar o techAgent:", error);
    return "Eu costumo usar tecnologias modernas como React, Next.js, TypeScript e Node.js. Me conta o que você precisa que posso te orientar melhor!";
  }
}
