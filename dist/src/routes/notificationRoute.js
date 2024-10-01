"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = __importDefault(require("../controller/notificationController"));
const notificationRoute = express_1.default.Router();
notificationRoute.post('/create-many-notification', (req, res, next) => {
    notificationController_1.default.createManyNotification(req, res, next);
});
notificationRoute.get('/get-all', (req, res, next) => {
    notificationController_1.default.getAll(req, res, next);
});
/**
 * @swagger
 * tags:
 *   name: notifications
 *   description: The Notification  API
 * /notifications/get-all:
 *   get:
 *     summary: Lists all the notifications
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: The list of the notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal server error
 *
 * */
exports.default = notificationRoute;
