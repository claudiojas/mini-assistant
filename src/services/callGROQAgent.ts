import { checkEnvironmentVariable } from "./checkEnvironmentVariable";

export const callGROQAgent = async (systemPrompt: string, userPrompt: string) => {
    checkEnvironmentVariable();

    const response = await fetch(process.env.GROQ_API_URL || "", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
  
    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  }
  


const GEMINI_API_KEY = process.env.GEMINI_API_KEY ||'';
const url = `${process.env.GEMINI_API_URL}${GEMINI_API_KEY}`;

const headers = {
  'Content-Type': 'application/json',
};

export const calGeminiAgent = async ( systemPrompt: string, userPrompt: string ) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
                  system: ${systemPrompt}
                  user: ${userPrompt}
                `,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("resposta da gemini", data)
    return data;
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
  }
}
