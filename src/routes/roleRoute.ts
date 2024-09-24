import express from 'express';
import roleController from '../controller/roleController';

const roleRouter = express.Router();

// Define the route for creating a role
roleRouter.post('/create-role', roleController.createRoleID);

export default roleRouter;
