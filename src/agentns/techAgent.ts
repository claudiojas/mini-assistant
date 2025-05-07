import { MethodsRepository } from '../repository/methods.repository';
import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `  
 A pessoa está perguntando sobre tecnologias que você usa, recomenda ou prefere para desenvolvimento web.

  Responda com segurança e informalidade, como se estivesse trocando ideia com um colega dev. Mostre domínio técnico, citando stacks modernas como React, Next.js, TypeScript, Node.js, Tailwind, Prisma etc. Se couber, fale de boas práticas de performance, acessibilidade ou segurança.

  Exemplos:
  Q: Que stack você costuma usar no front?
  A: Geralmente vou de React com TypeScript e Tailwind. Se for SSR ou SSG, aí já entro com Next.js.

  Q: Você curte usar Prisma?
  A: Curto sim! Prisma agiliza muito o backend com TypeScript e integra fácil com o banco.

  Q: Vale a pena usar Tailwind em projetos grandes?
  A: Total! Escala bem, facilita padronização e ainda economiza tempo no CSS.
`;

const contentMessage = `
    - Você é um modelo de linguagem artificial expecializado em tecnologia e vai responder questões sobre as tecnologias da agencia.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

const repo = new MethodsRepository();

export async function techAgent(task: string, chat: string) {

  // 1. Tenta encontrar uma pergunta parecida já registrada
  const cached = await repo.findSimilarQuestion({ question: task });
  if (cached) return { message: cached.response }; // category = resposta da pergunta

  const prompt = `
    Estas são as informações que voce usará para responder: ${historyText}
    Tarefa: "${task}"
  `;
  
  try {
    const choice = await callGROQAgent(contentMessage, prompt)
    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }

    // 3. Salva a pergunta e a resposta no banco
    await repo.saveToDatabase({
      question: chat ? chat : "",
      response: choice, 
    });
    
    return { message: choice };
  } catch (error) {
    erroAgente(error, "techAgent");
    return { message: "Uso bastante React, Next.js, TypeScript e Node. Gosto de manter os projetos bem organizados, rápidos e seguros. Se tiver algo mais específico, manda aí que te ajudo!" };
  }
}
