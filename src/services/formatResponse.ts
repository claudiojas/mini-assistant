import { IGroqResponse } from "../types";


export function formatResponse(data: IGroqResponse): string {
    const content = data.choices?.[0]?.message?.content;
  
    if (!content) {
      throw new Error('No content found in the response.');
    }
  
    // Primeiro transforma \n\n em DUAS quebras reais
    let formatted = content
      .trim()
      .replace(/\\n\\n/g, '\n\n') // duas linhas
      .replace(/\\n/g, '\n'); // uma linha
  
    // Depois podemos deixar mais "estiloso", se quiser, por exemplo:
    // - Separar títulos
    // - Adicionar emojis
    // - Deixar mais amigável como resposta de chat
  
    // Exemplo simples:
    formatted = formatted
      .replace(/^### (.+)$/gm, '📝 **$1**') // deixa títulos com um ícone
      .replace(/^(\d+)\. (.+)$/gm, '🔹 $1. $2') // deixa listas numeradas com bullets
      .replace(/```([\s\S]*?)```/g, (match, code) => `\n📦 Código:\n${code}\n`)// formata blocos de código
  
    return formatted;
  }
  