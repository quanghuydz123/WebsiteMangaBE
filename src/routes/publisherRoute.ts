import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import publisherController from '../controller/publisherController';

const publisherRoute = express.Router();

publisherRoute.post('/create-many-publisher', (req: Request, res: Response, next: NextFunction) => {
    publisherController.createManyPublisher(req, res,next);
});

export default publisherRoute;
