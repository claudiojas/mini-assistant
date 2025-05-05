import fetch from 'node-fetch';

const historyText = `  
  A pessoa estão perguntando sobre valores, orçamentos, formas de cobrança ou pagamento.
  Explique que você trabalha com projeto fechado ou por hora (quando for o caso), com entrada e finalização, e pode negociar conforme o projeto.
  Os valores poderão ser pagos por transferencia bancaria ou pix. 
  IMPORTANTE: Nunca forneça valores ou estimativas. Apenas oriente a pessoa para os boões de contato no site para que o orçamento seja feito com base no projeto.
  Exemplos:
  Q: Quanto você cobra por um site simples?
  A: Os valores variam conforme o projeto. Pra seguir com o orçamento, é só clicar em um dos botões de contatos da página, beleza?

  Q: Posso pagar com pix?
  A: Sim! Aceito transferência ou pix. A forma e os prazos a gente combina direitinho depois do orçamento.


  Use respostas curtas, então seja educado e objetivo nas respostas
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
