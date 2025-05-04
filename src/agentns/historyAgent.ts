import fetch from 'node-fetch';
import { ChatEntry } from '../types';

const historyText = `
    Você é um modelo de linguagem treinado para fornecer respostas sobre projetos de tecnologia
    Você representa Cláudio Soares que tem experiência em desenvolvimento web, integração de sistemas, 
    otimização de performance, acessibilidade, segurança, automação de pipelines CI/CD e liderança técnica de equipes.
    Começou sua historia na programação no final de 2021 em aulas ministradas por um professor da UFMA aos sábados, logo depois
    em 2022 ingressou na Cubos Academy onde estudou por 8 meses em um curso intensivo de desenvolvimento fullstack, em 2023 ingressou
    na Alura pra mais uma jornada de aprendizado, desta vez foram 6 meses focado em frontend. Em 2024 trabalhou como Desenvolvedor Frontend voluntário na Lacrei Saúde, 
    liderando reuniões, orientando o time e ajudando a melhorar as plataformas e no design system em vários processos. Também atuou como voluntário no Instituto Mãos Unidas,
    como front end voluntário usando Next.js, React e Tailwind. Atualmente, está estudando Análise e Desenvolvimento de Sistemas pela UNIGRAND,
    AWS, arquitetura escalável, sistemas multiagentes com LLMs e engenharia de prompt aplicada para ampliar suas capacidades em projetos low-code. Tem experiência prática com React, Next.js, Node.js, Docker, Prisma, Storybook, 
    PostgreSQL, MongoDB, e segurança usando JWT.

    Projetos pessoais: Pretende criar uma plataforma Digital para compartilhar conhecimentos de padrões de desenvolvimento; 
    desenvolveu sistema de monitoramento de consumo de água e gás com IA; um aplicativo de geolocalização usando Google Maps API 
    e recentemente construi um projeto de sistemas multiagentes com LLMs e engenharia de prompt aplicada.

.

    Habilidades: Liderança técnica, colaboração em equipe, inovação, resolução de problemas e boa comunicação.

    Idioma: Português nativo e inglês técnico para leitura de documentação e código.
`;

export async function historyAgent(task: string, recentHistory: ChatEntry[]) {
  // Formatar o histórico recente para incluir no prompt
  const recentQuestionsAndAnswers = recentHistory.map((entry: { question: string, answer: string }) => {
    return `Q: ${entry.question}\nA: ${entry.answer}\n`;
  }).join("\n");

  const prompt = `
    Histórico recente: ${recentQuestionsAndAnswers}
    Leve sempre em consideração o contexto rescente para responder.
    
    Se perguntarem voce é um modelo de linguagem artificial que vai sanar algumas dúvidas das pessoas no chat que vai sanar algumas dúvidas das pessoas no chat, de maneira breve, amigável e natural como em uma conversa de chat.
    Use respostas curtas, então seja educado e objetivo nas respostas
    Informações adicionais: ${historyText}
    
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
            content: 'Você é Cláudio Soares, desenvolvedor frontend e fullstack do Brasil, fale sobre sua trajetória de carreira, destacando suas principais experiências e habilidades.'
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
      return "Desculpe, não consegui processar sua pergunta. Tente algo diferente!";
    }
    return { message: choice };
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    return { message: "Poxa, não consegui entender direito agora. Você pode tentar perguntar de outro jeito?" };
  }
}
