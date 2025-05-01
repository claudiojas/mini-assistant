import { historyAgent } from "../agentns/historyAgent";
import { memoryAgent } from "../agentns/memoryAgent";
import { pricingAgent } from "../agentns/pricingAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";
import { smalltalkAgent } from "../agentns/smalltalkAgent";
import { techAgent } from "../agentns/techAgent";
import { ChatHistory } from "../services/chatHistory";
import { classifyTask } from "../services/classifyService";


const agentMap = {
  history: historyAgent,
  services: servicesAgent,
  projects: projectsAgent,
  memory: memoryAgent,
  smalltalk: smalltalkAgent,
  tech: techAgent,
  pricing: pricingAgent,
};

const chatHistory = new ChatHistory(); 

export const orchestrateTask = async (task: string ) => {
  // A primeira parte pode ser onde você analisa o tipo de tarefa.
  const type = await classifyTask(task);

  // Obtenha o agente a ser utilizado com base no tipo
  const agent = agentMap[type as keyof typeof agentMap];

  // Antes de chamar o agente, você pode obter o contexto recente (últimas perguntas e respostas)
  const recentHistory = chatHistory.getRecentQuestionsAndAnswers();

  // Passa a pergunta e o histórico recente para o agente
  const agentResponse = agent ? await agent(task, recentHistory) : { message: 'Desculpe, não entendi sua pergunta. Você pode reformular?' };

  // Agora, você adiciona a pergunta e a resposta ao histórico
  chatHistory.addHistory(task, agentResponse);

  // Retorna a resposta do agente ao usuário
  return agentResponse;
};
