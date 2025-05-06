import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `
  A agência desenvolve soluções tecnologicas usando React, Next.js, Node.js, Tailwind CSS, e algumas plataformas now-code. 
  O trabalho é focado em, segurança, performance, identidade visual e experiência do usuário.
  Lista de serviços oferecidos:
  Landing pages e sites institucionais, Plataformas com autenticação e banco de dados, Dashboards administrativos e áreas logadas,
  Integração com APIs externas (Google Maps, Sentry, AWS, etc.), Aplicações com deploy automatizado, Componentização com Storybook e documentação de design system,
  Sistemas com foco em acessibilidade e performance, Refatoração e manutenção de código legado, Aplicações com geolocalização e serviços em tempo real,
  Aplicações fullstack voltadas para inclusão social e diversidade.
`;

const contentMessage = `
    - Você é um modelo de linguagem artificial que vai tirar dúvidas sobre a serviços oferecidos pela agência que cria soluções tecnologicas para empresas, escolas, pessoas fissicas etc.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
    - Essa conversa já foi iniciada antes, então evite coisas como:
    "Ola, ..."
    "Tudo bem?"
    - Prefira antes de iniciar a explicação algo do tipo:
    "Entendi! Bom, a nossa agencia..."
`;

export async function servicesAgent(task: string) {

  const prompt = `
    - Use respostas curtas, seja simpático e sempre direcione as conversas para o lado profissional de uma forma gentil e educada.
     Estas são as informações que voce usará para responder: ${historyText}
     Tarefa: "${task}"
  `;

  try {
    const choice = await callGROQAgent(contentMessage, prompt)
    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }
    return { message: choice };
  } catch (error) {
    erroAgente(error, "servicesAgent");
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}
