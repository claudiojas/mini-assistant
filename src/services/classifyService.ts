import { cachedClassifications } from "./cachedClassifications";
import { similarityMatch } from "./similarityMatch";

export const classifyTask = async (task: string): Promise<
  'history' | 'services' | 'projects' | 'memory' | 'smalltalk' | 'tech' | 'pricing' | 'contacts' | 'other' | 'Limite de tokens atingido. Tente novamente mais tarde.'
> => {
  const prompt = `
    Classifique a mensagem a seguir com apenas uma palavra, escolhendo entre: history, services, projects, memory, smalltalk, tech, pricing, contacts, other, Limite de tokens atingido. Tente novamente mais tarde.
  `;

  
  try {
    const cached = cachedClassifications(task);
    if (cached) return cached;

    const matched = similarityMatch(task);
    if (matched) return matched;

    const response = await fetch(process.env.GROQ_API_URL || "", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um classificador de tarefas. Responda apenas com a categoria.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
      
    });

    const data = await response.json();
    if (data.error?.code === "rate_limit_exceeded") {
      console.warn("Limite de tokens atingido. Tente novamente mais tarde.");
      return 'Limite de tokens atingido. Tente novamente mais tarde.';
    }
    const validCategories = ['history', 'services', 'projects', 'memory', 'smalltalk', 'tech', 'pricing', 'contacts', 'other', 'Limite de tokens atingido. Tente novamente mais tarde.'];

    const category = data.choices?.[0]?.message?.content.trim().toLowerCase();
    if (!validCategories.includes(category)) {
      return 'other';
    }   
    return data.choices?.[0]?.message?.content.trim() || 'other';
  } catch (error) {
    console.error("Erro no classificador:", error);
    return 'other';
  }
};
