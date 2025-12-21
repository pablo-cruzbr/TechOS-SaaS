import express from "express";
import type { Request, Response, NextFunction } from "express"; 
import 'express-async-errors';
import cors from 'cors'; 
import path from 'path'; 
import { router } from "./routes"; 
const app = express();

app.use(express.json());

app.use(cors()); 

app.get("/hello", (req, res) => {
  return res.json({
    status: "online",
    message: "Servidor TechOS funcionando com sucesso!",
    timestamp: new Date().toISOString()
  });
});

app.use(router); 

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ status: 'error', message: 'Internal server error.' });
});

export default app;

app.listen(3334, () => {
  console.log('Servidor API TechOS Online na porta 3334!');
});