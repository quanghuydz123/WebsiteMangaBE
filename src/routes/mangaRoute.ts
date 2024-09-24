import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import mangaController from '../controller/mangaController';

const mangaRoute = express.Router();

mangaRoute.post('/create-many-manga', (req: Request, res: Response, next: NextFunction) => {
    mangaController.createManyManga(req, res,next);
});

mangaRoute.get('/get-all', (req: Request, res: Response, next: NextFunction) => {
    mangaController.getAll(req, res,next);
});

export default mangaRoute;
