import { historyAgent } from "../agentns/historyAgent";
import { memoryAgent } from "../agentns/memoryAgent";
import { pricingAgent } from "../agentns/pricingAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";
import { smalltalkAgent } from "../agentns/smalltalkAgent";
import { techAgent } from "../agentns/techAgent";


// Mockando o fetch global
jest.mock('node-fetch', () => require('../__mocks__/fetch').default);

// Histórico simulado (pode ser reutilizado por qualquer agent que aceite contexto)
const mockHistory = [
  {
    question: "Oi, tudo bem?",
    answer: "Tudo sim, e por aí?"
  }
];

describe("Agentes de Cláudio", () => {
  it("Deve responder sobre o histórico profissional", async () => {
    const resposta = await historyAgent("Fale da sua trajetória.", mockHistory);
    expect(resposta.toLowerCase()).toContain("trajetória");
  });

  it("Deve responder sobre projetos realizados", async () => {
    const resposta = await projectsAgent("Você já trabalhou com mapas?", mockHistory);
    expect(resposta.toLowerCase()).toContain("mapa");
  });

  it("Deve responder sobre serviços e forma de trabalho", async () => {
    const resposta = await servicesAgent("Como funciona o pagamento?", mockHistory);
    expect(resposta.toLowerCase()).toContain("pagamento");
  });

  it("Deve responder sobre preços e formas de cobrança", async () => {
    const resposta = await pricingAgent("Você cobra por hora ou projeto?", mockHistory);
    expect(resposta.toLowerCase()).toMatch(/hora|projeto/);
  });

  it("Deve responder de forma informal a uma conversa leve", async () => {
    const resposta = await smalltalkAgent("E aí, tá por aqui ainda?");
    expect(resposta.length).toBeGreaterThan(0);
  });

  it("Deve lembrar ou comentar algo sobre o nome ou contexto da conversa", async () => {
    const resposta = await memoryAgent("Você lembra meu nome?", mockHistory);
    expect(resposta.toLowerCase()).toMatch(/nome|lembrar/);
  });

  it("Deve responder sobre tecnologias utilizadas", async () => {
    const resposta = await techAgent("Você trabalha com React?", mockHistory);
    expect(resposta.toLowerCase()).toMatch(/react|typescript|node/);
  });
});
