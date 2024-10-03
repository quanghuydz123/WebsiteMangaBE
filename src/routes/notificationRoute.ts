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
 *               notifications:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal server error
 * 
 * */

notificationRoute.post('/create-notification', (req: Request, res: Response, next: NextFunction) => {
    notificationController.createNotification(req, res,next);
});

/**
 * @swagger
 * /notifications/create-notification:
 *   post:
 *     summary: create notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "string"
 *               idUser:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:   
 *         description: create notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 notifications:
 *                   $ref: '#/components/schemas/Notification' 
 *       500:
 *         description: Internal server error
 * 
 * */
export default notificationRoute;
