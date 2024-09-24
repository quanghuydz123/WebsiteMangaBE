import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

userRouter.get('/get-all', (req: Request, res: Response,next :NextFunction) => {
    userController.getAll(req, res,next);
});

userRouter.post('/create-many-user', (req: Request, res: Response,next :NextFunction) => {
    userController.createManyUser(req, res,next);
});

export default userRouter;
