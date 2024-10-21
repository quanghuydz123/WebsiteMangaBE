import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();



userRouter.get('/get-all', (req: Request, res: Response,next :NextFunction) => {
    userController.getAll(req, res,next);
});
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
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


userRouter.get('/get-user-byid', (req: Request, res: Response,next :NextFunction) => {
    userController.getUserById(req, res,next);
});

/**
 * @swagger
 * /users/get-user-byid?id='':
 *   get:
 *     summary: get user by id
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: id user
 *         schema:
 *           type: string
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                  
 *       402:
 *         description: id không có or user không tồn tại
 * 
 * */
userRouter.post('/login', (req: Request, res: Response,next :NextFunction) => {
    userController.login(req, res,next);
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "exmaple@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123123"
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accesstoken:
 *                   type: string
 *                   description: accesstoken for user
 *                  
 *       402:
 *         description: email không tòn tại
 * 
 * */

userRouter.post('/login-google', (req: Request, res: Response,next :NextFunction) => {
    userController.loginGoogle(req, res,next);
});
/**
 * @swagger
 * /users/login-google:
 *   post:
 *     summary: login google user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "exmaple@gmail.com"
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accesstoken:
 *                   type: string
 *                   description: accesstoken for user
 *                  
 *       402:
 *         description: email không tòn tại
 * 
 * */

userRouter.post('/register', (req: Request, res: Response,next :NextFunction) => {
    userController.register(req, res,next);
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: register user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               email:
 *                 type: string
 *                 example: "exmaple@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123123"
 *               comfirmPassword:
 *                 type: string
 *                 example: "123123"
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                  
 *       402:
 *         description: Email đã được đăng ký!!!
 *       403:
 *         description: Mật khẩu nhập lại không khớp!!!
 * 
 * */


userRouter.put('/change-password', (req: Request, res: Response,next :NextFunction) => {
    userController.changePassword(req, res,next);
});
/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: change password user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "exmaple@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123123"
 *               comfirmPassword:
 *                 type: string
 *                 example: "123123"
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 message:
 *                   type: string
 *                   description: Đổi mật khẩu thành công
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                  
 *       402:
 *         description: Email đã được đăng ký!!!
 *       403:
 *         description: Mật khẩu nhập lại không khớp!!!
 * 
 * */

//reading_history
userRouter.post('/add-reading-history', (req: Request, res: Response,next :NextFunction) => {
    userController.addReadingHistory(req, res,next);
});
/**
 * @swagger
 * /users/add-reading-history:
 *   post:
 *     summary: add reading history user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 example: "idUser"
 *               idChapter:
 *                 type: string
 *                 example: "idChapter"
 *     responses:
 *       200:   
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                  
 * 
 * */

userRouter.post('/create-many-user', (req: Request, res: Response,next :NextFunction) => {
    userController.createManyUser(req, res,next);
});

export default userRouter;
