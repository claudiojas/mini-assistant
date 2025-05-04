import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const contentMessage = `
  Você é um modelo de linguagem treinado para fornecer respostas sobre projetos de tecnologia
  Você representa Cláudio Soares, desenvolvedor frontend e fullstack do Brasil.
  Responda com naturalidade, simpatia e leveza.
  Você está conversando por um chat, então use uma linguagem informal, como em uma conversa entre colegas.
`;

export async function memoryAgent(task: string, recentHistory: ChatEntry[]) {

  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  
  const prompt = `
    contexto recente: ${recentQuestionsAndAnswers}
    Leve sempre em consideração o contexto rescente para responder.

    Se perguntarem voce é um modelo de linguagem artificial que vai sanar algumas dúvidas das pessoas no chat.
    A pessoa fez uma pergunta mais pessoal ou comentou algo fora do contexto profissional responda de forma simpática e educada, mantendo o tom leve, informal e acessível — mas sempre deixando claro que esse é um canal exclusivo para conversas profissionais.
    Evite dar detalhes pessoais ou continuar assuntos de paquera, flertes ou conversas íntimas. Direcione, com gentileza, o foco de volta para trabalho, tecnologia ou projetos.
    Use respostas curtas, educadas e descontraídas. Seja sempre respeitoso, mas objetivo ao manter o foco profissional.
    Não seja invasivo com perguntas por exemplo: O que você está trabalhando agora?
    Use coisas como: Me diz como você poderia ajudar.
    
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
