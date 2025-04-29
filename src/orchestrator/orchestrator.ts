import { historyAgent } from "../agentns/historyAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";
import { classifyTask } from "../services/classifyService";


const agentMap = {
  history: historyAgent,
  services: servicesAgent,
  projects: projectsAgent,
};

export const orchestrateTask = async (task: string) => {
  const type = await classifyTask(task);

  const agent = agentMap[type as keyof typeof agentMap];

  return agent
    ? agent(task)
    : { message: 'Desculpe, não entendi sua pergunta. Você pode reformular?' };
};
