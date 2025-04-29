export default async function fetchMock(url: string, options: any) {
    return {
      json: async () => ({
        choices: [
          {
            message: {
              content: `Resposta simulada para a tarefa: ${JSON.parse(options.body).messages[1].content}`,
            },
          },
        ],
      }),
    };
  }
  