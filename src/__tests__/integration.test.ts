import { historyAgent } from "../agentns/historyAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";
import { orchestrateTask } from "../orchestrator/orchestrator";
import { classifyTask } from "../services/classifyService";

// Mock da função classifyTask para não fazer chamadas reais à API do GROQ
jest.mock('../services/classifyService', () => ({
  classifyTask: jest.fn(),
}));

// Mock dos agentes para simular as respostas
jest.mock('../agentns/historyAgent', () => ({
  historyAgent: jest.fn(), // Mock da função historyAgent diretamente
}));

jest.mock('../agentns/projectsAgent', () => ({
  projectsAgent: jest.fn(),
}));

jest.mock('../agentns/servicesAgent', () => ({
  servicesAgent: jest.fn(),
}));

describe('Testes de Integração', () => {
  it('deve orquestrar corretamente a tarefa de história', async () => {
    // Configurando os mocks
    (classifyTask as jest.Mock).mockResolvedValue('history');
    (historyAgent as jest.Mock).mockResolvedValue('Histórico profissional de Cláudio');

    const response = await orchestrateTask('Fale sobre sua trajetória profissional');
    
    expect(classifyTask).toHaveBeenCalledWith('Fale sobre sua trajetória profissional');
    expect(historyAgent).toHaveBeenCalledWith('Fale sobre sua trajetória profissional');
    expect(response).toBe('Histórico profissional de Cláudio');
  });

  it('deve orquestrar corretamente a tarefa de projetos', async () => {
    (classifyTask as jest.Mock).mockResolvedValue('projects');
    (projectsAgent as jest.Mock).mockResolvedValue('Projetos de Cláudio');

    const response = await orchestrateTask('Quais projetos você desenvolveu?');
    
    expect(classifyTask).toHaveBeenCalledWith('Quais projetos você desenvolveu?');
    expect(projectsAgent).toHaveBeenCalledWith('Quais projetos você desenvolveu?');
    expect(response).toBe('Projetos de Cláudio');
  });

  it('deve orquestrar corretamente a tarefa de serviços', async () => {
    (classifyTask as jest.Mock).mockResolvedValue('services');
    (servicesAgent as jest.Mock).mockResolvedValue('Serviços de Cláudio');

    const response = await orchestrateTask('Quais serviços você oferece?');
    
    expect(classifyTask).toHaveBeenCalledWith('Quais serviços você oferece?');
    expect(servicesAgent).toHaveBeenCalledWith('Quais serviços você oferece?');
    expect(response).toBe('Serviços de Cláudio');
  });

  it('deve retornar uma mensagem padrão quando não houver correspondência', async () => {
    (classifyTask as jest.Mock).mockResolvedValue('unknown');
    
    const response = await orchestrateTask('Como está o clima hoje?');
    
    expect(response).toEqual({ message: 'Desculpe, não entendi sua pergunta. Você pode reformular?' });
  });
});
