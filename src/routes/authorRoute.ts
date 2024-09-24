import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import authorController from '../controller/authorController';

const authorRoute = express.Router();

authorRoute.post('/create-many-author', (req: Request, res: Response,next :NextFunction) => {
    authorController.createManyAuthor(req, res,next);
});

export default authorRoute;
