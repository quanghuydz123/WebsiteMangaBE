import express from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

// Define the route for getting all users
userRouter.get('/get-all', userController.getAll);

export default userRouter;
