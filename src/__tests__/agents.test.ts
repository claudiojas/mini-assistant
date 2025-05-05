import { historyAgent } from "../agentns/historyAgent";
import { memoryAgent } from "../agentns/memoryAgent";
import { pricingAgent } from "../agentns/pricingAgent";
import { projectsAgent } from "../agentns/projectsAgent";
import { servicesAgent } from "../agentns/servicesAgent";
import { smalltalkAgent } from "../agentns/smalltalkAgent";
import { techAgent } from "../agentns/techAgent";

// Mockando o fetch global
jest.mock('node-fetch', () => require('../__mocks__/fetch').default);

const mockHistory = [
  {
    question: "Oi, tudo bem?",
    answer: "Tudo sim, e por aí?"
  }
];

describe("Agentes de Cláudio", () => {
  it("Deve responder sobre o histórico profissional", async () => {
    const resposta = await historyAgent("Fale da sua trajetória.");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(texto.toLowerCase()).toContain("stackwise");
  });

  it("Deve responder sobre projetos realizados", async () => {
    const resposta = await projectsAgent("Você já trabalhou com mapas?");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(texto.toLowerCase()).toContain("google maps");
  });

  it("Deve responder sobre serviços e forma de trabalho", async () => {
    const resposta = await servicesAgent("Como funciona o pagamento?");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(texto.toLowerCase()).toContain("pagamento");
  });

  it("Deve responder sobre preços e formas de cobrança", async () => {
    const resposta = await pricingAgent("Você cobra por hora ou projeto?");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(texto.toLowerCase()).toMatch(/depende.*projeto/);
  });

  it("Deve responder de forma informal a uma conversa leve", async () => {
    const resposta = await smalltalkAgent("E aí, tá por aqui ainda?");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(typeof texto).toBe("string");
    expect(texto.length).toBeGreaterThan(0);
  });

  it("Deve lembrar ou comentar algo sobre o nome ou contexto da conversa", async () => {
    const resposta = await memoryAgent("Você lembra meu nome?");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(texto.toLowerCase()).toMatch(/nome|lembrar/);
  });

  it("Deve responder sobre tecnologias utilizadas", async () => {
    const resposta = await techAgent("Você trabalha com React?");
    const texto = typeof resposta === "string" ? resposta : resposta.message;
    expect(texto.toLowerCase()).toMatch(/react|typescript|node/);
  });
});

