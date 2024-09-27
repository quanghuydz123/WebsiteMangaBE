import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import ratingController from '../controller/ratingController';

const ratingRoute = express.Router();

ratingRoute.post('/create-many-rating', (req: Request, res: Response, next: NextFunction) => {
    ratingController.createManyRating(req, res,next);
});


ratingRoute.get('/get-all', (req: Request, res: Response, next: NextFunction) => {
    ratingController.getAll(req, res,next);
});
/**
 * @swagger
 * tags:
 *   name: ratings
 *   description: The Rating  API
 * /ratings/get-all:
 *   get:
 *     summary: Lists all the ratings
 *     tags: [Rating]
 *     responses:
 *       200:   
 *         description: The list of the ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 *       500:
 *         description: Internal server error
 * 
 * */

export default ratingRoute;
