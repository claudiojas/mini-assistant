import { Category } from "../types";

export const cachedClassifications = (task: string) => {
    const cachedClassifications: Record<string, Category> = {
        "quanto custa?": "pricing",
        "vocês têm whatsapp?": "contacts",
        "oi": "smalltalk",
        "olá": "smalltalk",
        "quero agendar uma reunião": "contacts",
        "qual experiência da empresa?": "history"
      };
    const cachedKey = task.toLowerCase().trim();
    if (cachedClassifications[cachedKey]) {
      return cachedClassifications[cachedKey];
    }
}