import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import chapterController from '../controller/chapterController';

const chapterRoute = express.Router();

chapterRoute.post('/create-many-chapter', (req: Request, res: Response, next: NextFunction) => {
    chapterController.createManyChapter(req, res, next);
});
/**
 * @swagger
 * /chapters/get-page:
 *   get:
 *     summary: Get paginated chapters for a specific manga
 *     tags: [Chapters]
 *     parameters:
 *       - name: mangaId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the manga
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: The page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: The number of records per page
 *     responses:
 *       200:
 *         description: A paginated list of chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page number
 *                 totalChapters:
 *                   type: integer
 *                   description: Total number of chapters
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages available
 *                 chapters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: uuid
 *                         description: Unique identifier for the chapter
 *                       title:
 *                         type: string
 *                         description: Title of the chapter
 *                       isDeleted:
 *                         type: boolean
 *                         description: Indicates if the chapter is deleted
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the chapter
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Last update date of the chapter
 *                       imageLink:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Array of image URLs for the chapter
 *       500:
 *         description: Server error
 */
chapterRoute.get('/get-page', chapterController.getPaginatedChapters);
/**
 * @swagger
 * /chapters/get-advanced-page:
 *   get:
 *     summary: Get advanced paginated chapters with filtering
 *     tags: [Chapters]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: Number of items per page
 *       - name: filter
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           description: Comma-separated list of fields to include in the response
 *     responses:
 *       200:
 *         description: Successfully retrieved chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalChapters:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 chapters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       isDeleted:
 *                         type: boolean
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       imageLink:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */
chapterRoute.get('/get-advanced-page', chapterController.getAdvancedPaginatedChapter);
/**
 * @swagger
 * /chapters/append:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manga:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the manga
 *               title:
 *                 type: string
 *                 description: Title of the chapter
 *               imageLink:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for the chapter
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     isDeleted:
 *                       type: boolean
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     imageLink:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Server error
 */
chapterRoute.post('/append', chapterController.appendChapter);
/**
 * @swagger
 * /chapters/update:
 *   put:
 *     summary: Update an existing chapter
 *     tags: [Chapters]
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the chapter to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the chapter
 *               isDeleted:
 *                 type: boolean
 *                 description: Indicates if the chapter is deleted
 *               imageLink:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for the chapter
 *               isReturnNewData:
 *                 type: boolean
 *                 description: If true, returns the updated chapter; if false, returns null
 *     responses:
 *       200:
 *         description: Chapter updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     isDeleted:
 *                       type: boolean
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     imageLink:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */
chapterRoute.put('/update', chapterController.updateChapter);



export default chapterRoute;
