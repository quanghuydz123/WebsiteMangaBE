import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import roleController from '../controller/roleController';

const roleRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     roles:
 *       type: object
 *       description: Các quyền trong hệ thống
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of your role
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the role was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the role was last updated
 */

roleRouter.post('/create-many-role', (req: Request, res: Response, next: NextFunction) => {
    roleController.createManyRole(req, res,next);
});

export default roleRouter;
