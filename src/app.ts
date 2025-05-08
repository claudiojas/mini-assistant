// src/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { postTask } from './router/POST';

export class App {

    private app: Application;

    constructor (){
        this.app = express();
    };

    async listen(){
        const PORT = 3000; 

        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}!!`); 
        });
    };

    // Method to register middlewares and routes
    register(){
        this.app.use(cors({
        //   origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
            origin: '*',
            credentials: true
        }));

        this.app.use(express.json());

        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(postTask);
    }
}