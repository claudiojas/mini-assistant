export default async function fetch(url: string) {
  if (url === 'https://api.example.com') {
    return {
      json: async () => ({ message: 'Histórico da agência Stackwise' }),
      ok: true,
    };
  }

  return {
    json: async () => ({ message: 'Erro desconhecido' }),
    ok: false,
  };
}
