
import { Category } from "../types";

export const similarityMatch = (task: string): Category | null => {
  const lower = task.toLowerCase();

  if (lower.includes("reunião") || lower.includes("agendar")) return "contacts";
  if (lower.includes("preço") || lower.includes("custa")) return "pricing";
  if (lower.startsWith("oi") || lower.startsWith("olá")) return "smalltalk";

  return null;
};
