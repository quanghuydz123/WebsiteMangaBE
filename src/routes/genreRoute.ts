import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import genreController from '../controller/genreController';

const genreRoute = express.Router();

genreRoute.post('/create-many-genre', (req: Request, res: Response, next: NextFunction) => {
    genreController.createManyGenre(req, res, next);
});
/**
 * @swagger
 * /genres/get-page:
 *   get:
 *     summary: Get paginated list of genres ( admin -> all , user -> only when isDeleted=false)
 *     tags: [Genres]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit of items per page
 *     responses:
 *       200:
 *         description: A paginated list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalGenres:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 genres:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Server error
 */
genreRoute.get('/get-page', genreController.getPaginatedGenres);
/**
 * @swagger
 * /genres/get-advanced-page:
 *   get:
 *     summary: Get advanced paginated list of genres with filter
 *     tags: [Genres]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter fields (comma-separated)
 *     responses:
 *       200:
 *         description: Advanced paginated list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalGenres:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 genres:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Server error
 */
genreRoute.get('/get-advanced-page', genreController.getAdvancedPaginatedGenres);
/**
 * @swagger
 * /genres/create:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Action"
 *               slug:
 *                 type: string
 *                 example: "action"
 *               isReturnNewData:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Genre created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
genreRoute.post('/create', genreController.createGenre);
/**
 * @swagger
 * /genres/update:
 *   put:
 *     summary: Update a genre
 *     tags: [Genres]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               isDeleted:
 *                 type: boolean
 *               isReturnNewData:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Server error
 */
genreRoute.put('/update', genreController.updateGenre);

export default genreRoute;
