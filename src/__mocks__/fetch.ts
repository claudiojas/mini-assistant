export default async function fetchMock(url: string ) {
    return {
      json: async () => ({
        choices: [
          {
            message: {
              content: `Resposta simulada para a tarefa: ${url}`,
            },
          },
        ],
      }),
    };
  }
  