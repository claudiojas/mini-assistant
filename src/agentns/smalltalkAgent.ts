import { MethodsRepository } from '../repository/methods.repository';
import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `  
  A pessoa estara puxando papo de forma a entender como funciona a agencia, saber informações sobre e quem sabe tentar uma conversa mais descontraida, 
  mas o foco é em trabalho, tecnologia e a soluções oferecidas pela agencia.
  Responda de maneira leve, com bom humor, como em uma conversa informal de chat mas mantenha o assunto no profissional, não use apelidos 
  ou frases carinhosas. É pra ser educado. Use português do Brasil, linguagem simples e emojis com moderação.

  Evite responder perguntas que fujam completamente do contexto profissional. Se a pergunta não tiver relação com trabalho, responda com gentileza, mas direcione de volta ao foco.
`;

const contentMessage = `
    - Você é um modelo de linguagem artificial que vai fazer o primeiro contato com os clientes da agencia, por tanto, seja recepitivo, gentil, educado.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

const repo = new MethodsRepository();

export async function smalltalkAgent(task: string) {

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
      question: task,
      response: choice, // nesse caso, category é a resposta
    });
    
    return { message: choice };
  } catch (error) {
    erroAgente(error, "smalltalkAgent");
    return { message: "Haha, boa pergunta! 😄" };
  }
}
