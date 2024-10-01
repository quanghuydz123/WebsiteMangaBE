"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publisherController_1 = __importDefault(require("../controller/publisherController"));
const publisherRoute = express_1.default.Router();
publisherRoute.post('/create-many-publisher', (req, res, next) => {
    publisherController_1.default.createManyPublisher(req, res, next);
});
publisherRoute.get('/get-all', (req, res, next) => {
    publisherController_1.default.getAll(req, res, next);
});
/**
 * @swagger
 * tags:
 *   name: publishers
 *   description: The Publisher  API
 * /publishers/get-all:
 *   get:
 *     summary: Lists all the publishers
 *     tags: [Publisher]
 *     responses:
 *       200:
 *         description: The list of the publishers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publisher'
 *       500:
 *         description: Internal server error
 *
 * */
exports.default = publisherRoute;
