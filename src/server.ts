// src/server.ts
import express, { Request, Response } from 'express';
import { orchestrateTask } from './orchestrator/orchestrator';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080'
}));

app.use(express.json());

app.post('/task', async (req: Request, res: Response) => {
  const task = req.body.task;

  if (!task || typeof task !== 'string' || !task.trim()) {
    res.status(400).send({ error: 'Task is required and must be a non-empty string!' });
    return;
  }

  try {
    const result = await orchestrateTask(task);
    res.status(200).send({ result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Erro ao orquestrar task:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
