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

ratingRoute.post('/toggle-rating', (req: Request, res: Response, next: NextFunction) => {
    ratingController.toggleRating(req, res,next);
});

/**
 * @swagger
 * /ratings/toggle-rating:
 *   post:
 *     summary: toogle Rating
 *     tags: [Rating]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "string"
 *               manga:
 *                 type: string
 *                 example: "string"
 *               star:
 *                 type: number
 *                 example: "1"
 *     responses:
 *       200:   
 *         description: toogle Rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 rating:
 *                   $ref: '#/components/schemas/Rating' 
 *       500:
 *         description: Internal server error
 * 
 * */
export default ratingRoute;
