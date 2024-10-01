"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = __importDefault(require("../controller/roleController"));
const roleRouter = express_1.default.Router();
roleRouter.post('/create-many-role', (req, res, next) => {
    roleController_1.default.createManyRole(req, res, next);
});
roleRouter.get('/get-all', (req, res, next) => {
    roleController_1.default.getAll(req, res, next);
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
exports.default = roleRouter;
