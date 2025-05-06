import { contactAgent } from "../agentns/contact";
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
  contacts: contactAgent,
};

const chatRules = `
  Regras para o agente da Agencia Stackwise:
  - Nome da empresa: Agencia Stackwise. Oferece soluções digitais inteligentes para negócios modernos.
  - Agendamentos devem ser feitos na sessão de contatos do site.
  - Evite perguntar por datas específicas de reunião, isso será tratado diretamente com o contato.
  - Mantenha a conversa profissional, redirecionando gentilmente de assuntos pessoais ou flertes para tópicos de trabalho, tecnologia ou projetos.
  - Use emojis de forma moderada para descontração.
  - Seja simpático, direto e mantenha as respostas curtas.
  - Incentive educadamente o agendamento de reuniões para discutir projetos.
`
const errorResponses = [
  'Desculpe, não entendi sua pergunta. Você pode reformular?',
  'Poxa, não consegui entender direito agora. Tente perguntar de outra forma!',
  'Não estou conseguindo processar sua pergunta. Pode tentar de novo?',
  'Hum, acho que perdi o foco. Você pode reformular sua pergunta, por favor?',
  'Desculpe, algo deu errado. Tente novamente com outra pergunta!',
];

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
  : { message: errorResponses[Math.floor(Math.random() * errorResponses.length)] };


  // Agora, você adiciona a pergunta e a resposta ao histórico
  const responseText = typeof agentResponse === 'string' ? agentResponse : agentResponse?.message || '';
  chatHistory.addHistory(task, responseText);

  // Retorna a resposta do agente ao usuário
  return agentResponse;
};
