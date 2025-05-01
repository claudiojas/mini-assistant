// src/server.ts
import express, { Request, Response } from 'express';
import { orchestrateTask } from './orchestrator/orchestrator';
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:8080'
}));

// Middleware para entender JSON
app.use(express.json());

// Rota principal para orquestrar tarefas
app.post('/task', async (req: Request, res: Response) => {
  const task = req.body.task;
  if (!task) {
    res.status(400).send({ error: 'Task is required!' });
    return 
  }

  try {
    const result = await orchestrateTask(task);
    res.status(200).send({ result });
    return
    
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
    return 
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
