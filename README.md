# Mini Assistant

Projeto simples de orquestração de agentes utilizando Node.js, Express e OpenAI.

Este projeto foi desenvolvido para servir como uma arquitetura minimalista de assistente, inspirado no conceito de "mini-n8n", com foco em modularidade, testes e extensibilidade de tarefas automatizadas.

> Repositório: [github.com/claudiojas/mini-assistant](https://github.com/claudiojas/mini-assistant.git)

---

## Tecnologias Usadas

- Node.js
- TypeScript
- Express
- Axios
- dotenv
- OpenAI API
- Jest (para testes)
- TSX (para desenvolvimento com hot-reload)

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor em modo desenvolvimento usando `tsx` com hot-reload.

## Estrutura de Pastas

```
src/
├── agentns/
│   ├── historyAgent.ts
│   ├── projectsAgent.ts
│   └── servicesAgent.ts
├── orchestrator/
│   └── orchestrator.ts
├── services/
│   └── classifyService.ts
├── server.ts
└── tests/
    └── integration.test.ts
```

### Descrição dos Diretórios:

- `agentns/`: Contém os agentes que tratam tarefas específicas (histórico, projetos, serviços).
- `orchestrator/`: Contém a lógica que decide qual agente chamar com base na classificação da tarefa.
- `services/`: Serviços de apoio, como o serviço de classificação de tarefas usando IA.
- `tests/`: Testes de integração utilizando Jest para validar o fluxo orquestrado.
- `server.ts`: Arquivo principal que inicializa o servidor Express.

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
OPENAI_API_KEY=your_openai_api_key
```

4. Inicie o projeto em modo desenvolvimento:

```bash
npm run dev
```

---

## Rodando os Testes

Execute o comando abaixo para rodar os testes de integração:

```bash
npx jest
```

---

## Exemplo de Fluxo de Orquestração

1. O usuário envia uma tarefa, como: `"Fale sobre sua trajetória profissional"`.
2. O serviço `classifyService` classifica essa tarefa como `history`.
3. O `orchestrator` chama o `historyAgent` para tratar essa tarefa.
4. O agente retorna a resposta apropriada para o usuário.

Se a classificação não bater com nenhuma categoria conhecida, retorna uma mensagem padrão de erro educada.

---

## Licença

ISC License.

---

# English Version

# Mini Assistant

Simple agent orchestration project using Node.js, Express, and OpenAI.

This project was developed to serve as a minimalist assistant architecture, inspired by the "mini-n8n" concept, focusing on modularity, testing, and extensibility for automated tasks.

> Repository: [github.com/claudiojas/mini-assistant](https://github.com/claudiojas/mini-assistant.git)

---

## Technologies Used

- Node.js
- TypeScript
- Express
- Axios
- dotenv
- OpenAI API
- Jest (for testing)
- TSX (for hot-reload development)

## Available Scripts

- `npm run dev` — Starts the server in development mode using `tsx` with hot-reload.

## Project Structure

```
src/
├── agentns/
│   ├── historyAgent.ts
│   ├── projectsAgent.ts
│   └── servicesAgent.ts
├── orchestrator/
│   └── orchestrator.ts
├── services/
│   └── classifyService.ts
├── server.ts
└── tests/
    └── integration.test.ts
```

### Directory Description:

- `agentns/`: Contains agents that handle specific tasks (history, projects, services).
- `orchestrator/`: Contains logic to decide which agent to call based on task classification.
- `services/`: Support services, like task classification using AI.
- `tests/`: Integration tests using Jest to validate the orchestration flow.
- `server.ts`: Main file that initializes the Express server.

---

## How to Run the Project

1. Clone the repository:

```bash
git clone https://github.com/claudiojas/mini-assistant.git
cd mini-assistant
```

2. Install dependencies:

```bash
npm install
```

3. Set up a `.env` file with your OpenAI key:

```bash
OPENAI_API_KEY=your_openai_api_key
```

4. Start the project in development mode:

```bash
npm run dev
```

---

## Running Tests

Run the following command to execute the integration tests:

```bash
npx jest
```

---

## Example of Orchestration Flow

1. The user sends a task, like: `"Fale sobre sua trajetória profissional"`.
2. The `classifyService` classifies this task as `history`.
3. The `orchestrator` calls the `historyAgent` to handle the task.
4. The agent returns the appropriate response to the user.

If the classification does not match any known category, a polite default error message is returned.

---

## License

ISC License.