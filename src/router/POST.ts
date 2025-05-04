import { Router } from "express"; 
import { orchestrateTask } from "../orchestrator/orchestrator";

export const postTask = Router();

postTask.post('/task', async (req, res) => {
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