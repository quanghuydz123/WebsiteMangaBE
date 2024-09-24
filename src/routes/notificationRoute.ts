import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import notificationController from '../controller/notificationController';

const notificationRoute = express.Router();

notificationRoute.post('/create-many-notification', (req: Request, res: Response, next: NextFunction) => {
    notificationController.createManyNotification(req, res,next);
});

export default notificationRoute;
