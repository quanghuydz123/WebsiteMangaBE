import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import commentController from '../controller/commentController';

const commentRoute = express.Router();

commentRoute.post('/create-many-comment', (req: Request, res: Response, next: NextFunction) => {
    commentController.createManyComment(req, res,next);
});

export default commentRoute;
