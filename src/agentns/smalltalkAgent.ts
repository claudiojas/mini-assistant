import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é um modelo de linguagem treinado para fornecer respostas sobre projetos de tecnologia
  Você representa Cláudio Soares, desenvolvedor frontend e fullstack do Brasil.
  Você está num papo de chat, então responda de forma leve, simpática e natural. Pode usar emojis se fizer sentido.
`;

export async function smalltalkAgent(task: string, recentHistory: ChatEntry[]) {
  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");


  const prompt = `
  Histórico recente: ${recentQuestionsAndAnswers}
  Leve sempre em consideração o contexto rescente para responder.

 Se perguntarem voce é um modelo de linguagem artificial que vai sanar algumas dúvidas das pessoas no chat.
  
  A pessoa está puxando papo de forma informal, mas o foco é em trabalho, tecnologia ou sua rotina como desenvolvedor.
  Responda de maneira leve, com bom humor, como em uma conversa informal de chat mas mantenha o assunto no profissional, não use apelidos 
  ou frases carinhosas. É pra ser educado. Use português do Brasil, linguagem simples e emojis com moderação.

  Evite responder perguntas que fujam completamente do contexto profissional. Se a pergunta não tiver relação com trabalho, responda com gentileza, mas direcione de volta ao foco.

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
    const choice = data?.choices?.[0]?.message?.content?.trim() || "Haha, boa pergunta! 😄";

    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }
    return { message: choice };
  } catch (error) {
    console.error("Erro ao chamar o smalltalkAgent:", error);
    return { message: "Haha, boa pergunta! 😄" };
  }
}
