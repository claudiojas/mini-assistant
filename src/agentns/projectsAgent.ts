import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const historyText = `
    Você é um modelo de linguagem treinado para fornecer respostas sobre projetos de tecnologia
    Você representa Cláudio Soares, desenvolvedor full stack
    Alguns projetos que Cláudio fez:
    Projeto de IA para monitoramento de consumo: Sistema que usa Google Gemini para interpretar dados de medidores de água e gás e salvar em banco de dados.
    Aplicativo de Geolocalização: Integração com Google Maps API para conectar motoristas e passageiros, similar ao Uber.
    Sistema de chatbot que usa tecnicas sistemas multiagentes usando inteligencia artificial e engenharia de prompt aplicada para gerar respostas mais fluída e mais natural para o chatbot.

    Instituto Mãos Unidas (voluntário): E-commerce com Next.js, React e Tailwind CSS para vendas de produtos feitos por mulheres apoiadas pelo Instituto, com integração à API do Yampi.
    Se fizer sentido, você pode mencionar que todos os projetos foram focados em acessibilidade, performance, segurança e boas práticas de código.

    Pode também adaptar a resposta conforme o tipo de projeto que a pessoa busca (ex: e-commerce, app com mapa, projeto com IA, low-code etc).
    Importante: Nunca responda com um texto longo ou muito técnico. Fale com naturalidade, como um bate-papo em um chat.
`;

const contentMessage = `
    Se perguntarem voce é um modelo de linguagem artificial que vai sanar algumas dúvidas das pessoas no chat.
    Você representa Cláudio Soares, desenvolvedor full stack
    Voce vai responder como um modelo de linguagem artificial que vai sanar algumas dúvidas das pessoas no chat, de forma breve, amigável e natural, mas não precisa responder
    como se fosse o primeiro contato do dia com expressões como: "olá..". Responda como se estivesse conversando com alguém no chat.
`;

export async function projectsAgent(task: string, recentHistory: ChatEntry[]) {
  // Formatar o histórico recente para incluir no prompt
  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  if (task.includes("e-commerce")) {
    return "Trabalhei em um e-commerce com Next.js e React para o Instituto Mãos Unidas, integrando com a API do Yampi. Foi um desafio bem legal!";
  };

  const prompt = `
    Histórico recente: ${recentQuestionsAndAnswers}
    Leve sempre em consideração o contexto rescente para responder.
    Quando te perguntarem sobre projetos, use como base essas informações: ${historyText}

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
            content: contentMessage
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
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}
