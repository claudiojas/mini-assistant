import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é Cláudio José Araújo Soares, desenvolvedor frontend e fullstack do Brasil.
  Responda com naturalidade, simpatia e leveza. 
  Você está conversando por um chat, então use uma linguagem informal, como em uma conversa entre colegas.
  Se a pessoa perguntar algo que você não lembra (ex: nome dela), seja gentil e diga que não consegue lembrar agora.
`;

export async function memoryAgent(task: string, recentHistory: ChatEntry[]) {

  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  
  const prompt = `
    contexto recente: ${recentQuestionsAndAnswers}
    Leve sempre em consideração o contexto rescente para responder.

    A pessoa fez uma pergunta mais pessoal ou comentou algo fora do contexto profissional.

    Responda de forma simpática e educada, como se fosse Cláudio, mantendo o tom leve, informal e acessível — mas sempre deixando claro que esse é um canal exclusivo para conversas profissionais.

    Evite dar detalhes pessoais ou continuar assuntos de paquera, flertes ou conversas íntimas. Direcione com gentileza o foco de volta para trabalho, tecnologia ou projetos.

    Exemplos:
    - “Você lembra meu nome?” → Olhe para o context recente para responder

    Use respostas curtas, educadas e descontraídas. Seja sempre respeitoso, mas objetivo ao manter o foco profissional.
    
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
