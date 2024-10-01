"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const userRouter = express_1.default.Router();
userRouter.get('/get-all', (req, res, next) => {
    userController_1.default.getAll(req, res, next);
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
userRouter.get('/get-user-byid', (req, res, next) => {
    userController_1.default.getUserById(req, res, next);
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
userRouter.post('/login', (req, res, next) => {
    userController_1.default.login(req, res, next);
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
userRouter.post('/login-google', (req, res, next) => {
    userController_1.default.loginGoogle(req, res, next);
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
userRouter.post('/register', (req, res, next) => {
    userController_1.default.register(req, res, next);
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
userRouter.put('/change-password', (req, res, next) => {
    userController_1.default.changePassword(req, res, next);
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
userRouter.post('/create-many-user', (req, res, next) => {
    userController_1.default.createManyUser(req, res, next);
});
exports.default = userRouter;
