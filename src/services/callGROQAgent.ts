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
  