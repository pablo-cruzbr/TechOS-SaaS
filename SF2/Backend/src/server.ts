// server.ts atualizado

import express from "express";
import type { Request, Response, NextFunction } from "express"; 
import 'express-async-errors';

import cors from 'cors'; 
import path from 'path'; 
import { router } from "./routes"; 

const app = express();

app.use(express.json());

app.get("/hello", (req, res) => {
  return res.json({
    status: "online",
    message: "Servidor TechOS funcionando com sucesso!",
    timestamp: new Date().toISOString()
  });
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.listen(3334, () => {
    console.log('Servidor API TechOS Online na porta 3334!');
});