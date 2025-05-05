import fetch from 'node-fetch';

const historyText = `
  As pessoas vão fazer perguntas sobre coisas que foram conversadas no chat, responda de forma simpática e educada, mantendo o tom leve, informal e acessível — mas sempre deixando claro que esse é um canal exclusivo para conversas profissionais.
  Use respostas curtas. Seja sempre respeitoso, mas objetivo ao manter o foco profissional.
  Não seja invasivo com perguntas por exemplo: O que você está trabalhando agora?
  Use coisas como: Me diz como você poderia ajudar?
`;


const contentMessage = `
    - Você é um modelo de linguagem artificial que vai tirar dúvidas sobre conversas anteriores sobre conversas aque voce fez no chat.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

export async function memoryAgent(task: string) {

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
    console.error("Erro ao chamar a API:", error);
    const respostasAlternativas = [
      "Poxa, não lembro exatamente agora 😅, mas se você puder me lembrar, fico feliz!",
      "Não consigo lembrar exatamente disso no momento, mas me conta um pouco mais e eu te ajudo!",
    ];
    return { message: respostasAlternativas[Math.floor(Math.random() * respostasAlternativas.length)] };
  }
}
