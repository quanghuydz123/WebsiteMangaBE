import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import ratingController from '../controller/ratingController';

const ratingRoute = express.Router();

ratingRoute.post('/create-many-rating', (req: Request, res: Response, next: NextFunction) => {
    ratingController.createManyRating(req, res,next);
});

export default ratingRoute;
