import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import genreController from '../controller/genreController';

const genreRoute = express.Router();

genreRoute.post('/create-many-genre', (req: Request, res: Response, next: NextFunction) => {
    genreController.createManyGenre(req, res,next);
});

export default genreRoute;
