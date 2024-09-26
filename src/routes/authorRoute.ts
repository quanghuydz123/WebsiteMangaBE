import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import authorController from '../controller/authorController';

const authorRoute = express.Router();

/**
 * @swagger
 * /authors/create-many-author:
 *   post:
 *     summary: KHÔNG ĐƯỢC DÙNG API NÀY
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     bio:
 *                       type: string
 *                       example: "An author of many books."
 *                     birthDate:
 *                       type: string
 *                       format: date
 *                       example: "1980-01-01"
 *     responses:
 *       201:
 *         description: Authors created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Authors created successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
authorRoute.post('/create-many-author', (req: Request, res: Response, next: NextFunction) => {
    authorController.createManyAuthor(req, res, next);
});

/**
 * @swagger
 * /authors/get-advanced-page:
 *   get:
 *     summary: Retrieve a paginated list of authors using advance filter
 *     tags: [Author]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve (default is 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of authors to retrieve per page (default is 10)
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: filter
 *         required: false
 *         description: Comma-separated list of attributes to include in the response.
 *         schema:
 *           type: string
 *           default: "_id,name,createAt"
 *     responses:
 *       200:
 *         description: A paginated list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page number
 *                 totalAuthors:
 *                   type: integer
 *                   description: The total number of author entries
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 authors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *       500:
 *         description: Internal server error
 */
authorRoute.get('/get-advanced-page', authorController.getAdvancedPaginatedAuthor);

/**
 * @swagger
 * /authors/get-page:
 *   get:
 *     summary: Retrieve paginated list of authors
*     tags: [Author]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve (default is 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of authors to retrieve per page (default is 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A paginated list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page number
 *                 totalAuthors:
 *                   type: integer
 *                   description: The total number of author entries
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 authors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *               example:
 *                 page: 1
 *                 totalAuthors: 100
 *                 totalPages: 10
 *                 authors:
 *                   - _id: "66f1812835029f5058744e97"
 *                     name: "Author Name"
 *                     isDeleted: false
 *                     createAt: "2023-09-25T16:08:13.011Z"
 *                     updatedAt: "2023-09-25T16:08:13.011Z"
 */
authorRoute.get('/get-page', authorController.getPaginatedAuthor);

/**
 * @swagger
 * /authors/create:
 *   post:
 *     summary: Create a new author
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               isReturnNewData:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Author created successfully."
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Author'
 *                     - type: "null"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Name is required."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
authorRoute.post('/create', authorController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an existing author
 *     tags: [Author]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               isDeleted:
 *                 type: boolean
 *                 example: false
 *               isReturnNewData:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Author updated successfully."
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Author'
 *                     - type: "null"
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Author not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
authorRoute.put('/:id', authorController.updateAuthor);
export default authorRoute;
