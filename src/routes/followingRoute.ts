import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import followingController from '../controller/followingController';

const followingRoute = express.Router();

followingRoute.post('/create-many-following', (req: Request, res: Response, next: NextFunction) => {
    followingController.createManyFollowing(req, res,next);
});

export default followingRoute;
