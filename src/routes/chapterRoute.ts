import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import chapterController from '../controller/chapterController';

const chapterRoute = express.Router();

chapterRoute.post('/create-many-chapter', (req: Request, res: Response,next: NextFunction) => {
    chapterController.createManyChapter(req, res,next);
});

chapterRoute.get('/get-all', (req: Request, res: Response,next: NextFunction) => {
    chapterController.getAll(req, res,next);
});


export default chapterRoute;
