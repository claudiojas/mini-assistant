import { callGROQAgent } from '../services/callGROQAgent';
import { erroAgente } from '../services/erroAgent';

const historyText = `  
  A pessoa está perguntando sobre valores, orçamentos ou formas de pagamento.
  Explique que os projetos podem ser cobrados por hora ou de forma fechada, com entrada e finalização, sendo possível negociar conforme o projeto.
  Os pagamentos podem ser feitos via transferência bancária ou pix.
  IMPORTANTE: Nunca forneça valores ou estimativas. Apenas direcione a pessoa aos botões de contato no site para que o orçamento seja feito com base nas especificações do projeto.

  Exemplos:
  Q: Quanto você cobra por um site simples?  
  A: Os valores variam conforme o projeto. Para um orçamento, é só usar os botões de contato no site.

  Q: Posso pagar com pix?  
  A: Sim, aceito transferência ou pix. A forma e os prazos são combinados após o orçamento.

  Seja direto e educado nas respostas, mantendo-as curtas.

`;

const contentMessage = `
  Você é um modelo de linguagem treinado para fornecer respostas sobre formas de pagamento da agencia
  Fale formas de pagamento com clareza e empatia, de forma informal e direta mas nunca feche acordos ou dê preços
  em vez disso, de forma educada, direcione para os botões de contatos da página.
`;

export async function pricingAgent(task: string) {
  const prompt = `
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
    erroAgente(error, "pricingAgent");
    return { message: "Posso fazer um orçamento com base no seu projeto! Preencha o formulário no site e logo entro em contato 😉" };
  }
}
