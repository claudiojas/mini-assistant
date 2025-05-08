# Mini Assistant - Em desenvolvimento.
Mini Assistant é um projeto simples de orquestração de agentes utilizando Node.js, Express, OpenAI e MongoDB.
Este projeto foi idealizado para fins de estudo sobre arquiteturas de sistemas multiagentes com LLMs, 
aplicando técnicas de engenharia de prompt e otimização de chamadas externas.

> Repositório: [github.com/claudiojas/mini-assistant](https://github.com/claudiojas/mini-assistant.git)

---

## Tecnologias Usadas

- Node.js
- TypeScript
- Express
- dotenv
- LLM
- Prisma
- MongoDB Atlas
- TSX (para desenvolvimento com hot-reload)

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor em modo desenvolvimento usando `tsx` com hot-reload.

## Estrutura de Pastas

```
src/
├── agentns/
│   ├── contacts.ts
│   ├── historyAgent.ts
│   ├── memotyAgent.ts
│   ├── pricingAgent.ts
│   ├── projectsAgent.ts
│   ├── servicesAgent.ts
│   ├── smaltalkAgent.ts
│   └── tecAgent.ts
├── DB/
│   └── prisma.config.ts
├── interfaces/
│   └── interfaces.ts
├── orchestrator/
│   └── orchestrator.ts
├── repository/
│   └── methods.repository.ts
├── router/
│   └── POST.ts
├── services/
│   └── classifyService.ts
│   └── cachedClassifications.ts
│   └── callGROQAgent.ts
│   └── chatHistory.ts
│   └── checkEnvironmentVariable.ts
│   └── classifyService.ts
│   └── erroAgent.ts
│   └── formatResponse.ts
├── types/
│   └── index.ts
├── app.ts
└── server.ts
```

### Descrição dos Diretórios:

- `agentns/`: Contém os agentes que tratam tarefas específicas (histórico, projetos, serviços).
- `DB/`: Contém as configurações do Prisma.
- `interfaces/`: Contém as interfaces dos metodos do repositorio.
- `repository/`: Contém os metodos de acesso ao banco de dados.
- `router/`: Contém as rotas da aplicação.
- `orchestrator/`: Contém a lógica que decide qual agente chamar com base na classificação da tarefa.
- `services/`: Serviços de apoio, como o serviço de classificação de tarefas usando IA.
- `app/`: Contém as configurações de inicialização do sistema.
- `server.ts`: Arquivo principal que inicializa o servidor Express.

![ChatGPT Image 8 de mai  de 2025, 00_25_58](https://github.com/user-attachments/assets/a78658f1-aef4-4c0c-8b32-6ba4085ca5b4)


---

## Como Rodar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/claudiojas/mini-assistant.git
cd mini-assistant
```

2. Instale as dependências:

```bash
npm install
```

3. Configure um arquivo `.env` com sua chave da OpenAI:

```bash
    GROQ_API_KEY="Chave da LLM"
    GROQ_API_URL = "URL base da api"
    CORS_ORIGIN="URL da api" 
    DATABASE_URL="URL do seu banco de dados"
```

4. Inicie o projeto em modo desenvolvimento:

```bash
npm run dev
```

## Exemplo de Fluxo de Orquestração

1. O usuário envia uma tarefa, como: `"Fale sobre sua trajetória profissional"`.
2. O `orchestrator` acessa o metodo findSimilarQuestion para ver se já existe uma pergunta igual ao que o usuário fez, se existir já retorna a resposta para o usuário se não vai seguir o fluxo.
3. O serviço `classifyService` classifica essa tarefa como `history`.
    2.1 A função cachedClassifications busca na memória se existe uma classificação semelhante, se houver retorna a categoria se não retornar nada o fuxo seguei
    2.2 Se não retornar nada de cachedClassifications a função similarityMatch é chamada, ela faz uma busca em uma lista por similaridade da chamada do usuário e palavras da memória ligadas a uma categoria, se encontar retorna a categoria, se não o fluxo segue.
    2.3 Se não retornar nada faz a chamada na LLM que retorna uma categoria.
4. O `orchestrator` verifica no chama o `historyAgent` para tratar essa tarefa que retorna uma resposta da LLM e armazena essa nova pergunta e resposta no banco de dados.
4. O agente retorna a resposta apropriada para o usuário.
Se a classificação não bater com nenhuma categoria conhecida, retorna uma mensagem padrão de erro educada.

---

## Licença

ISC License.


