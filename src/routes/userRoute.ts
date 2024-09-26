import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The userss managing API
 * /users/get-all:
 *   get:
 *     summary: Lists all the users
 *     tags: [Users]
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 * 
 * */

userRouter.get('/get-all', (req: Request, res: Response,next :NextFunction) => {
    userController.getAll(req, res,next);
});

userRouter.post('/create-many-user', (req: Request, res: Response,next :NextFunction) => {
    userController.createManyUser(req, res,next);
});

export default userRouter;
