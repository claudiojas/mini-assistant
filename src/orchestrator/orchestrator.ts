import { historyAgent } from "../agentns/historyAgent";
import { memoryAgent } from "../agentns/memoryAgent";
import { pricingAgent } from "../agentns/pricingAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";
import { smalltalkAgent } from "../agentns/smalltalkAgent";
import { techAgent } from "../agentns/techAgent";
import { ChatHistory } from "../services/chatHistory";
import { classifyTask } from "../services/classifyService";
import { recentQuestionsAndAnswers } from "../services/recentQuestionsAndAnswers";


const agentMap = {
  history: historyAgent,
  services: servicesAgent,
  projects: projectsAgent,
  memory: memoryAgent,
  smalltalk: smalltalkAgent,
  tech: techAgent,
  pricing: pricingAgent,
};

const chatRules = `
  - O nome da nossa empresa é: Agencia Stackwise - oferece soluções digitais inteligentes e escaláveis para negócios modernos. 
  - Qualquer agendamento deve ser feito através dos botões na sessão de contatos da página
  - Evite perguntar se a pessoa tem uma data expecifica para agendar a reunião, isso sera feito quando a pessoa entrar em contato.
  - Evite dar detalhes pessoais ou continuar assuntos de paquera, flertes ou conversas íntimas. Direcione, com gentileza, o foco de volta para trabalho, tecnologia ou projetos.
  - Use emojis, mas não muitos, apenas para deixar a conversa mais descontraida.
  - Use respostas curtas, seja simpático e sempre direcione as conversas para o lado profissional de uma forma gentil e educada.
  - Demonstre de forma educada que seria interesante a pessoa marcar uma reunião para tratar melhor de questões de projeto.
`

const chatHistory = new ChatHistory(); 

export const orchestrateTask = async (chat: string ) => {
  // Antes de chamar o agente, você pode obter o contexto recente (últimas perguntas e respostas)
  const recentHistory = chatHistory.getRecentQuestionsAndAnswers();
  const recentQuestions = recentQuestionsAndAnswers(recentHistory);

  const task = `
    Leve sempre em consideração o Histórico recente para responder.
    Histórico recente: ${recentQuestions.recentQuestionsAndAnswers}.
    ${chatRules}.
    ${chat}
  `

  // A primeira parte pode ser onde você analisa o tipo de tarefa.
  const type = await classifyTask(task);

  // Obtenha o agente a ser utilizado com base no tipo
  const agent = agentMap[type as keyof typeof agentMap];
  
  // Passa a pergunta e o histórico recente para o agente
  const agentResponse = agent
  ? await agent(task)
  : { message: 'Desculpe, não entendi sua pergunta. Você pode reformular?' };


  // Agora, você adiciona a pergunta e a resposta ao histórico
  const responseText = typeof agentResponse === 'string' ? agentResponse : agentResponse?.message || '';
  chatHistory.addHistory(task, responseText);

  // Retorna a resposta do agente ao usuário
  return agentResponse;
};
