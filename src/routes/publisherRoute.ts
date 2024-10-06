import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import publisherController from '../controller/publisherController';

const publisherRoute = express.Router();

publisherRoute.post('/create-many-publisher', (req: Request, res: Response, next: NextFunction) => {
    publisherController.createManyPublisher(req, res,next);
});


publisherRoute.get('/get-all', (req: Request, res: Response, next: NextFunction) => {
    publisherController.getAll(req, res,next);
});

/**
 * @swagger
 * tags:
 *   name: publishers
 *   description: The Publisher  API
 * /publishers/get-all:
 *   get:
 *     summary: Lists all the publishers
 *     tags: [Publisher]
 *     responses:
 *       200:   
 *         description: The list of the publishers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publisher'
 *       500:
 *         description: Internal server error
 * 
 * */

publisherRoute.post('/create-publisher', (req: Request, res: Response, next: NextFunction) => {
    publisherController.createPublisher(req, res,next);
});

/**
 * @swagger
 * /publishers/create-publisher:
 *   post:
 *     summary: create publisher
 *     tags: [Publisher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:   
 *         description: create publisher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 publisher:
 *                   $ref: '#/components/schemas/Publisher' 
 *       500:
 *         description: Internal server error
 * 
 * */
export default publisherRoute;
