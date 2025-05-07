import { MethodsRepository } from '../repository/methods.repository';
import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `
 Histórico da agência Stackwise
  A Stackwise foi fundada em 2021 com o propósito de oferecer soluções digitais inteligentes e escaláveis para negócios modernos. Criada por desenvolvedores apaixonados por inovação, a agência nasceu 100% online e se consolidou rapidamente no cenário digital como referência em projetos web e mobile construídos com o ecossistema JavaScript/TypeScript, incluindo React, Node.js e tecnologias de IA generativa.
  Desde o início, a Stackwise focou em criar experiências digitais fluidas, performáticas e bem arquitetadas, seja para startups em fase de validação ou para empresas que precisavam escalar suas operações digitais.
  Entre seus principais marcos estão:
  2022 – Desenvolvimento de um sistema inteligente para monitoramento de consumo de água e gás, utilizando Google Gemini para interpretar dados em tempo real e armazená-los com segurança em bancos de dados relacionais.
  2023 – Lançamento de um aplicativo mobile com geolocalização, inspirado em plataformas como Uber, conectando motoristas e passageiros com rotas otimizadas através da API do Google Maps.
  2023 – Criação de um chatbot com IA, combinando técnicas de sistemas multiagentes e engenharia de prompts, capaz de simular conversas naturais com alto grau de compreensão contextual.
  2024 – Produção de landing pages de alta conversão, com design responsivo, copywriting orientado a dados e integrações com ferramentas de marketing como Google Analytics, Meta Pixel e testes A/B.
  2024 – Entrega de painéis administrativos personalizados, com autenticação segura (JWT), dashboards em tempo real e controle granular de permissões para múltiplos tipos de usuários.
  2025 – Ampliação do portfólio com soluções SaaS baseadas em IA, integrando modelos generativos a fluxos de trabalho como atendimento ao cliente, organização interna e automações no front e no backend.
  Hoje, a Stackwise atende empresas e empreendedores de diversos setores, mantendo uma cultura de excelência técnica, agilidade na entrega e forte compromisso com a experiência do usuário final.
`;

const repo = new MethodsRepository();

export async function historyAgent(task: string, chat: string ) {

  // 1. Tenta encontrar uma pergunta parecida já registrada
  const cached = await repo.findSimilarQuestion({ question: task });
  if (cached) return { message: cached.response }; // category = resposta da pergunta()

  const prompt = `
    - Use respostas curtas, seja simpático e sempre direcione as conversas para o lado profissional de uma forma gentil e educada.
    Estas são as informações que voce usará para responder: ${historyText}
    Tarefa: "${task}"
  `;

  const contentMessage = `
    - Você é um modelo de linguagem artificial que vai tirar dúvidas sobre a história profissional sobre a agência que cria soluções tecnologicas para empresas, escolas, pessoas fissicas etc..
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

  try {
    const choice = await callGROQAgent(contentMessage, prompt)
   
    if (!choice || choice.length === 0) {
      return "Desculpe, não consegui processar sua pergunta. Tente algo diferente!";
    }

    // 3. Salva a pergunta e a resposta no banco
    await repo.saveToDatabase({
      question: chat ? chat : "",
      response: choice, 
    });

    return { message: choice };
  } catch (error) {
    erroAgente(error, "historyAgent");
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}