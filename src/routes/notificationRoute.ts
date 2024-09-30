import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import notificationController from '../controller/notificationController';

const notificationRoute = express.Router();

notificationRoute.post('/create-many-notification', (req: Request, res: Response, next: NextFunction) => {
    notificationController.createManyNotification(req, res,next);
});

notificationRoute.get('/get-all', (req: Request, res: Response, next: NextFunction) => {
    notificationController.getAll(req, res,next);
});
/**
 * @swagger
 * tags:
 *   name: notifications
 *   description: The Notification  API
 * /notifications/get-all:
 *   get:
 *     summary: Lists all the notifications
 *     tags: [Notification]
 *     responses:
 *       200:   
 *         description: The list of the notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal server error
 * 
 * */
export default notificationRoute;
