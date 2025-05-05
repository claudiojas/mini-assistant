import { checkEnvironmentVariable } from '../services/checkEnvironmentVariable';
import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `
  A agência já construiu com sucesso projetos como:
  Projeto de IA para monitoramento de consumo: Sistema que usa Google Gemini para interpretar dados de medidores de água e gás e salvar em banco de dados.
  Aplicativo de Geolocalização: Integração com Google Maps API para conectar motoristas e passageiros, similar ao Uber.
  Sistema de chatbot com IA: Uso de técnicas de sistemas multiagentes e engenharia de prompt aplicada para gerar respostas mais fluídas e naturais.
  Landing pages otimizadas para conversão: Páginas desenvolvidas com foco em performance, SEO e design responsivo, utilizadas em campanhas de marketing digital para captação de leads e validação de produtos.
  Painéis administrativos personalizados: Dashboards interativos com filtros, gráficos e gerenciamento de dados em tempo real para clientes de diversos segmentos.
  Integrações com APIs de pagamento: Implementações seguras com Stripe, PayPal e Pix, permitindo cobranças automatizadas e gestão de assinaturas.
  Plataforma de agendamento online: Sistema completo para profissionais autônomos e empresas, com confirmação automática por e-mail e integração com Google Agenda.
  Ambientes com autenticação e controle de acesso: Aplicações com login seguro, JWT, níveis de permissão e painéis distintos para cada tipo de usuário.
`;

const contentMessage = `
    - Você é um modelo de linguagem artificial que vai tirar dúvidas sobre a projetos profissionais sobre uma agência que cria soluções tecnologicas para empresas, escolas, pessoas fissicas etc.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

export async function projectsAgent(task: string) {

  const prompt = `
    Estas são as informações que voce usará para responder: ${historyText}
    Tarefa: "${task}"
  `;

  checkEnvironmentVariable();
  try {
    const choice = await callGROQAgent(contentMessage, prompt)
    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }
    return { message: choice };
  } catch (error) {
    erroAgente(error, "projectsAgent");
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}
