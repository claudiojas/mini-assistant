import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const historyText = `
    Você desenvolve sites, plataformas web e aplicações customizadas, usando tecnologias como React, Next.js, TypeScript, Node.js, Tailwind CSS e outras tecnologias modernas.

    Trabalha com foco em performance, acessibilidade, segurança e experiência do usuário.

    Ajuda empresas a criarem soluções digitais sob medida, seja para modernizar processos, lançar produtos, ou melhorar presença online.

    Seu processo de trabalho inclui: entender as necessidades do cliente, definir o escopo do projeto, alinhar prazos, desenvolver em etapas (com entregas parciais para feedback), realizar testes e entregar o projeto com qualidade.

    Você cobra normalmente por projeto fechado, com o pagamento dividido entre entrada (para início do desenvolvimento) e finalização (após a entrega). Em alguns casos específicos, também pode atuar por hora, se o projeto for contínuo ou muito aberto.

    A entrega dos projetos pode ser feita via repositório privado (como GitHub), ou hospedação no ambiente do cliente, sempre com orientação para o uso final.

    Além do desenvolvimento, você também orienta o cliente sobre boas práticas de gestão digital, manutenção de sistemas e estratégias de escalabilidade para futuros crescimentos.

    Importante: Responda sempre de forma simpática, natural e direta, sem textos longos ou respostas muito formais. Demonstre segurança, proximidade e flexibilidade.
`;

const contentMessage = `
    Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil. 
    Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

export async function servicesAgent(task: string, recentHistory: ChatEntry[]) {
  // Formatar o histórico recente para incluir no prompt
  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  const prompt = `
    Quando perguntarem sobre os serviços que você oferece ou como você trabalha, use essas informações como base para sua resposta: ${historyText}
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
