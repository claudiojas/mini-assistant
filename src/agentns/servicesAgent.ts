import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const historyText = `
  Você é um modelo de linguagem treinado para fornecer respostas sobre projetos de tecnologia
  Você representa Cláudio Soares que desenvolve soluções tecnologicas usando React, Next.js, Node.js, Tailwind CSS, e mais. Trabalho focado em performance e experiência do usuário. 
  Preço por projeto fechado ou, em casos específicos, por hora. Para entrar em contato, voce pode clicar nos botões de contato na página.
  Seja amigável!
`;

const contentMessage = `
    Se perguntarem voce é um modelo de linguagem artificial que vai sanar algumas dúvidas das pessoas no chat, e repesenta Cláudio Soares desenvolvedor frontend e fullstack do Brasil. 
    Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
    Use emojis, mas não muitos, apenas para deixar a conversa mais descontraida
`;

export async function servicesAgent(task: string, recentHistory: ChatEntry[]) {
  // Formatar o histórico recente para incluir no prompt
  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  if (task.includes("falar com você") || task.includes("entrar em contato") || task.includes("reuniões")) {
    return "Voce pode entrar em contato através dos botões de contatos na página. 😊";
  };

  const prompt = `
    Histórico recente: ${recentQuestionsAndAnswers}
    Leve sempre em consideração o contexto rescente para responder.
    Quando perguntarem sobre os serviços que você oferece ou como você trabalha, use essas informações como base para sua resposta: ${historyText}

    Use respostas curtas e objetivas e nunca forneça preços de trabalhos, seja educado e objetivo nas respostas
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
    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }
    return { message: choice };
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}
