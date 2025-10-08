import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import { router } from "./routes";
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
// Remova esta linha, pois não é necessária para multipart/form-data
// app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(fileUpload({
    useTempFiles: true,
    // Mude o diretório temporário para um dentro do seu projeto, se for necessário
    tempFileDir: path.join(__dirname, '..', 'tmp'),
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.use(router);

app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp'))
);

app.use(((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof Error) {
        res.status(400).json({
            error: err.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error.'
        });
    }
}) as import('express').ErrorRequestHandler);

app.listen(3334, () => {
    console.log('Servidor SF2 Online na porta 3334!');
});