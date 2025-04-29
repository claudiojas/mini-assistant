type GroqChoice = {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: any;
    finish_reason: string;
  }
  
export interface IGroqResponse {
id: string;
object: string;
created: number;
model: string;
choices: GroqChoice[];
usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
};
}
  