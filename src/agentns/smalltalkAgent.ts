import fetch from 'node-fetch';

const historyText = `  
  A pessoa estara puxando papo de forma a entender como funciona a agencia, saber informações sobre e quem sabe tentar uma conversa mais descontraida, 
  mas o foco é em trabalho, tecnologia e a soluções oferecidas pela agencia.
  Responda de maneira leve, com bom humor, como em uma conversa informal de chat mas mantenha o assunto no profissional, não use apelidos 
  ou frases carinhosas. É pra ser educado. Use português do Brasil, linguagem simples e emojis com moderação.

  Evite responder perguntas que fujam completamente do contexto profissional. Se a pergunta não tiver relação com trabalho, responda com gentileza, mas direcione de volta ao foco.
`;

const contentMessage = `
    - Você é um modelo de linguagem artificial que vai fazer o primeiro contato com os clientes da agencia, por tanto, seja recepitivo, gentil, educado.
    - Responda de forma breve, amigável e natural, como se estivesse conversando diretamente com um possível cliente no chat.
`;

export async function smalltalkAgent(task: string) {
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
    const choice = data?.choices?.[0]?.message?.content?.trim() || "Haha, boa pergunta! 😄";

    if (!choice || choice.length === 0) {
      return "Parece que houve um erro. Pode tentar novamente? Eu estou aqui para ajudar!";
    }
    return { message: choice };
  } catch (error) {
    console.error("Erro ao chamar o smalltalkAgent:", error);
    return { message: "Haha, boa pergunta! 😄" };
  }
}
