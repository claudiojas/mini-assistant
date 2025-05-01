import fetch from 'node-fetch';

const contentMessage = `
  Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil.
  Responda de forma breve, simpática e descontraída, como se estivesse batendo papo.
`;

export async function smalltalkAgent(task: string) {
  const prompt = `
    A pessoa está puxando papo ou fazendo uma pergunta informal, como “tudo bem?”, “como está o dia?”, “você curte programar?”.
    Responda de maneira leve, como em uma conversa informal no chat.

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
    if (!choice) {
      throw new Error("Resposta inválida da LLM.");
    }
    return choice;
  } catch (error) {
    console.error("Erro ao chamar o smalltalkAgent:", error);
    return "Haha, boa pergunta! 😄";
  }
}
