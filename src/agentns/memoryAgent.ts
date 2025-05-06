import { MethodsRepository } from '../repository/methods.repository';
import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `
  As pessoas vão fazer perguntas sobre coisas que foram conversadas no chat, responda de forma simpática e educada, mantendo o tom leve, informal e acessível — mas sempre deixando claro que esse é um canal exclusivo para conversas profissionais.
  Use respostas curtas. Seja sempre respeitoso, mas objetivo ao manter o foco profissional.
  Não seja invasivo com perguntas por exemplo: O que você está trabalhando agora?
  Use coisas como: Me diz como você poderia ajudar?
`;


const contentMessage = `
    - Você é um modelo de linguagem artificial que vai tirar dúvidas sobre conversas anteriores sobre conversas aque voce fez no chat.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

const repo = new MethodsRepository();

export async function memoryAgent(task: string) {

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
    erroAgente(error, "memoryAgent");
    const respostasAlternativas = [
      "Poxa, não lembro exatamente agora 😅, mas se você puder me lembrar, fico feliz!",
      "Não consigo lembrar exatamente disso no momento, mas me conta um pouco mais e eu te ajudo!",
    ];
    return { message: respostasAlternativas[Math.floor(Math.random() * respostasAlternativas.length)] };
  }
}
