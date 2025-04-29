import fetch from 'node-fetch';

export const classifyTask = async (task: string): Promise<'history' | 'services' | 'projects' | unknown> => {

  const prompt = `
    Classifique a seguinte tarefa em uma das seguintes categorias:
    - history
    - services
    - projects

    Apenas responda com uma palavra: history, services ou projects ou other.
    
    Tarefa: "${task}"
  `;


  try {
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
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const data = await response.json();
    
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.log("entrou no erro")
    return console.log(error)
  }
};
