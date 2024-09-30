import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import roleController from '../controller/roleController';

const roleRouter = express.Router();

roleRouter.post('/create-many-role', (req: Request, res: Response, next: NextFunction) => {
    roleController.createManyRole(req, res,next);
});

roleRouter.get('/get-all', (req: Request, res: Response, next: NextFunction) => {
    roleController.getAll(req, res,next);
});
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: The Role  API
 * /roles/get-all:
 *   get:
 *     summary: Lists all the Roles
 *     tags: [Role]
 *     responses:
 *       200:   
 *         description: The list of the Roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Internal server error
 * 
 * */

export default roleRouter;
