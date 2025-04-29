import { historyAgent } from "../agentns/historyAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";



// Mockando o fetch
jest.mock('node-fetch', () => require('../__mocks__/fetch').default);

describe('Agentes de Cláudio', () => {
  it('Deve responder sobre o histórico profissional', async () => {
    const resposta = await historyAgent('Fale da sua trajetória.');
    expect(resposta).toContain('trajetória');
  });

  it('Deve responder sobre projetos realizados', async () => {
    const resposta = await projectsAgent('Você já trabalhou com mapas?');
    expect(resposta).toContain('mapas');
  });

  it('Deve responder sobre serviços e forma de trabalho', async () => {
    const resposta = await servicesAgent('Como funciona o pagamento?');
    expect(resposta).toContain('pagamento');
  });
});
