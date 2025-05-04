import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil.
  Fale sobre preços e formas de pagamento com clareza e empatia, de forma informal e direta.
`;

export async function pricingAgent(task: string, recentHistory: ChatEntry[]) {

  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");


  const prompt = `
    Histórico recente: ${recentQuestionsAndAnswers}
    Leve sempre em consideração o contexto rescente para responder.

    A pessoa está perguntando sobre valores, orçamentos, formas de cobrança ou pagamento.
    Explique que você trabalha com projeto fechado ou por hora (quando for o caso), com entrada e finalização, e pode negociar conforme o projeto.
    Os valores poderão ser pagos por transferencia bancaria ou pix. 
    IMPORTANTE: Nunca forneça valores ou estimativas. Apenas oriente a pessoa a preencher o formulário do site para que o orçamento seja feito com base no projeto.
    Exemplos:
    Q: Quanto você cobra por um site simples?
    A: Os valores variam conforme o projeto. Pra seguir com o orçamento, é só preencher o formulário no site, beleza?

    Q: Posso pagar com pix?
    A: Sim! Aceito transferência ou pix. A forma e os prazos a gente combina direitinho depois do orçamento.


    Use respostas curtas, então seja educado e objetivo nas respostas

    Tarefa: "${task}"
  `;

  try { 
    const response = await fetch(process.env.GROQ_API_URL || "", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: contentMessage,
          },
          {
            role: 'user',
            content: prompt,
          },
        ]
      })
    });

    const data = await response.json();
    const choice = data?.choices?.[0]?.message?.content?.trim();
    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }
    return { message: choice };
  } catch (error) {
    console.error("Erro ao chamar o pricingAgent:", error);
    return { message: "Posso fazer um orçamento com base no seu projeto! Preencha o formulário no site e logo entro em contato 😉" };
  }
}
