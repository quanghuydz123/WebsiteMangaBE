import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import roleController from '../controller/roleController';

const roleRouter = express.Router();

roleRouter.post('/create-many-role', (req: Request, res: Response, next: NextFunction) => {
    roleController.createManyRole(req, res,next);
});

export default roleRouter;
