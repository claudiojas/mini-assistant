export const classifyTask = async (task: string): Promise<
  'history' | 'services' | 'projects' | 'memory' | 'smalltalk' | 'tech' | 'pricing' | 'other'
> => {
  const prompt = `
    Classifique a seguinte tarefa em uma das seguintes categorias:
    - history (trajetória ou histórico profissional)
    - services (o que você oferece ou como trabalha)
    - projects (projetos realizados)
    - memory (perguntas pessoais ou de contexto)
    - smalltalk (cumprimentos ou conversa informal)
    - tech (dúvidas sobre tecnologias ou stacks)
    - pricing (perguntas sobre preço ou orçamento)
    - other (se não se encaixar em nenhuma das anteriores)

    Apenas responda com uma palavra.
    
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
    const validCategories = ['history', 'services', 'projects', 'memory', 'smalltalk', 'tech', 'pricing', 'other'];
    if (!validCategories.includes(data.choices?.[0]?.message?.content.trim())) {
      return 'other';
    }   
    return data.choices?.[0]?.message?.content.trim() || 'other';
  } catch (error) {
    console.error("Erro no classificador:", error);
    return 'other';
  }
};
