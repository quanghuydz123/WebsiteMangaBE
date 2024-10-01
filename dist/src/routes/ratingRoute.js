"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratingController_1 = __importDefault(require("../controller/ratingController"));
const ratingRoute = express_1.default.Router();
ratingRoute.post('/create-many-rating', (req, res, next) => {
    ratingController_1.default.createManyRating(req, res, next);
});
ratingRoute.get('/get-all', (req, res, next) => {
    ratingController_1.default.getAll(req, res, next);
});
/**
 * @swagger
 * tags:
 *   name: ratings
 *   description: The Rating  API
 * /ratings/get-all:
 *   get:
 *     summary: Lists all the ratings
 *     tags: [Rating]
 *     responses:
 *       200:
 *         description: The list of the ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 *       500:
 *         description: Internal server error
 *
 * */
exports.default = ratingRoute;
