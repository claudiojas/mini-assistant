import { MethodsRepository } from '../repository/methods.repository';
import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `
    A pessoa esta perguntando sobre como entrar em contato ou agendar uma reunião. Voce vai sugerir
    educadamente que ele acesse a os botões de contato na pagina
`;

const repo = new MethodsRepository();

export async function contactAgent(task: string ) {

  // 1. Tenta encontrar uma pergunta parecida já registrada
  const cached = await repo.findSimilarQuestion({ question: task });
  if (cached) return { message: cached.response }; // category = resposta da pergunta

  console.log("passou aqui")

  const prompt = `
    - Use respostas curtas, seja simpático e sempre direcione as conversas para o lado profissional de uma forma gentil e educada.
    Estas são as informações que voce usará para responder: ${historyText}
    Tarefa: "${task}"
  `;

  const contentMessage = `
    - Você é um modelo de linguagem artificial que vai direcionar o usuário para os botões de contatos.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

  try {
    const choice = await callGROQAgent(contentMessage, prompt)
   
    if (!choice || choice.length === 0) {
      return "Desculpe, não consegui processar sua pergunta. Tente algo diferente!";
    }

    // 3. Salva a pergunta e a resposta no banco
    await repo.saveToDatabase({
      question: task,
      response: choice, // nesse caso, category é a resposta
    });
    
    return { message: choice };
  } catch (error) {
    erroAgente(error, "historyAgent");
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}