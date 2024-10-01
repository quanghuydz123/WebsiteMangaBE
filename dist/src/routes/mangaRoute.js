"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mangaController_1 = __importDefault(require("../controller/mangaController"));
const mangaRoute = express_1.default.Router();
mangaRoute.post('/create-many-manga', (req, res, next) => {
    mangaController_1.default.createManyManga(req, res, next);
});
mangaRoute.get('/get-all', (req, res, next) => {
    mangaController_1.default.getAll(req, res, next);
});
/**
 * @swagger
 * tags:
 *   name: Manga
 *   description: The manga managing API
 * /manga/get-all:
 *   get:
 *     summary: Lists all the manga
 *     tags: [Manga]
 *     parameters:
 *       - in: query
 *         name: searchValue
 *         required: false
 *         description: giá trị tìm kiếm truyện theo name
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: mặc định là 20
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: mặc định là 1
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortType
 *         required: false
 *         description: sắp xếp truyện từ a-z(ascName), z-a (descName), truyện mới nhất (latest-story),xem nhiều nhất (most-viewed)
 *         schema:
 *           type: string
 *       - in: query
 *         name: fillterGenre
 *         required: false
 *         description: tìm kiếm theo thể loại(truyền id)
 *         schema:
 *           type: string
 *       - in: query
 *         name: fillterAuthor
 *         required: false
 *         description: tìm kiếm theo tác giả (truyền id)
 *         schema:
 *           type: string
 *       - in: query
 *         name: fillterPublisher
 *         required: false
 *         description: tìm kiếm theo thể loại(truyền id)
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         description: 0 (chưa phát hành), 1 (còn cập nhập), 2 (Đã hoàn thành)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of the manga
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Manga'
 *       500:
 *         description: Internal server error
 *
 * */
mangaRoute.get('/get-manga-byid', (req, res, next) => {
    mangaController_1.default.getMangaById(req, res, next);
});
/**
 * @swagger
 * /manga/get-manga-byid?id='':
 *   get:
 *     summary: manga by id
 *     tags: [Manga]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: id user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: manga by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 manga:
 *                   $ref: '#/components/schemas/Manga'
 *       500:
 *         description: Internal server error
 *
 * */
mangaRoute.put('/update-manga-byid', (req, res, next) => {
    mangaController_1.default.updateMangaById(req, res, next);
});
/**
 * @swagger
 * /manga/update-manga-byid:
 *   put:
 *     summary: update manga by id
 *     tags: [Manga]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "abc"
 *               name:
 *                 type: string
 *                 example: "string"
 *               imageUrl:
 *                 type: string
 *                 example: "string"
 *               summary:
 *                 type: string
 *                 example: "string"
 *               author:
 *                 type: array
 *                 example: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
 *               publisher:
 *                 type: string
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               publish_date:
 *                 type: date
 *                 example: 0
 *               status:
 *                 type: int
 *                 example: number
 *               genres:
 *                 type: array
 *                 example: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
 *     responses:
 *       200:
 *         description: update manga by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 manga:
 *                   $ref: '#/components/schemas/Manga'
 *       500:
 *         description: Internal server error
 *
 * */
mangaRoute.post('/create-manga', (req, res, next) => {
    mangaController_1.default.createManga(req, res, next);
});
/**
 * @swagger
 * /manga/create-manga:
 *   post:
 *     summary: create manga
 *     tags: [Manga]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "string"
 *               imageUrl:
 *                 type: string
 *                 example: "string"
 *               summary:
 *                 type: string
 *                 example: "string"
 *               author:
 *                 type: array
 *                 example: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
 *               publisher:
 *                 type: string
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               publish_date:
 *                 type: date
 *                 example: 0
 *               status:
 *                 type: int
 *                 example: number
 *               genres:
 *                 type: array
 *                 example: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
 *     responses:
 *       200:
 *         description: update manga by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 manga:
 *                   $ref: '#/components/schemas/Manga'
 *       500:
 *         description: Internal server error
 *
 * */
mangaRoute.put('/increase-view', (req, res, next) => {
    mangaController_1.default.increaseView(req, res, next);
});
/**
 * @swagger
 * /manga/increase-view:
 *   put:
 *     summary: increase view manga by id
 *     tags: [Manga]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: increase view success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The status code (e.g., 200 for success)
 *                 manga:
 *                   $ref: '#/components/schemas/Manga'
 *       500:
 *         description: Internal server error
 *
 * */
exports.default = mangaRoute;