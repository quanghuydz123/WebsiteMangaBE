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
 *     tags: [Author]
 *     summary: Retrieve a paginated list of authors with advanced filtering options
 *     description: Returns a paginated list of authors with specific fields based on filtering.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of authors per page (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: filter
 *         required: false
 *         description: Comma-separated fields to include in the response.
 *         schema:
 *           type: string
 *           example: "name,createdAt,updatedAt"
 *     responses:
 *       200:
 *         description: A successful response containing the filtered and paginated list of authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authors retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalAuthors:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "60b8d95f1f10f14d4f0c9ae2"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-21T00:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-21T00:00:00Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving authors
 *                 data:
 *                   type: null
 */
authorRoute.get('/get-advanced-page', authorController.getAdvancedPaginatedAuthor);

/**
 * @swagger
 * /authors:
 *   get:
 *     tags: [Author]
 *     summary: Retrieve a paginated list of authors
 *     description: Returns a list of authors with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of authors per page (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A successful response containing the paginated list of authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authors retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalAuthor:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "60b8d95f1f10f14d4f0c9ae2"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving authors
 *                 data:
 *                   type: null
 */
authorRoute.get('/get-page', authorController.getPaginatedAuthor);

/**
 * @swagger
 * /authors/create:
 *   post:
 *     tags: [Author]
 *     summary: Create a new author
 *     description: Creates a new author and optionally returns the created author data.
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
 *                 description: The name of the author (required).
 *               isReturnNewData:
 *                 type: boolean
 *                 example: true
 *                 description: Flag indicating whether to return the created author data.
 *     responses:
 *       201:
 *         description: Author created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Author created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60b8d95f1f10f14d4f0c9ae2"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Bad Request (missing required field).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name is required.
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error: <error message>
 *                 data:
 *                   type: null
 */
authorRoute.post('/create', authorController.createAuthor);

/**
 * @swagger
 * /authors/update:
 *   put:
 *     summary: Update an existing author
 *     tags: [Author]
 *     parameters:
 *       - in: query
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
authorRoute.put('/update', authorController.updateAuthor);

/**
 * @swagger
 * /authors/complex-get:
 *   post:
 *     tags: [Author]
 *     summary: Retrieve authors based on complex queries with pagination
 *     description: Returns a paginated list of authors based on various filter criteria and options.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 example: 1
 *                 description: The page number to retrieve (default is 1).
 *               limit:
 *                 type: integer
 *                 example: 10
 *                 description: The number of authors per page (default is 10).
 *               filter:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John"
 *                     description: Filter authors by name (supports regex).
 *                   isDeleted:
 *                     type: boolean
 *                     example: false
 *                     description: Filter by deletion status.
 *               options:
 *                 type: object
 *                 properties:
 *                   select:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["name", "createdAt", "updatedAt"]
 *                     description: Fields to include in the response.
 *                   sort:
 *                     type: object
 *                     example: {"createdAt": -1}
 *                     description: Sort criteria.
 *                   lean:
 *                     type: boolean
 *                     example: true
 *                     description: Return plain JavaScript objects.
 *                   leanWithId:
 *                     type: boolean
 *                     example: true
 *                     description: Include `_id` as string if lean.
 *     responses:
 *       200:
 *         description: A successful response containing the filtered and paginated list of authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authors retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "60b8d95f1f10f14d4f0c9ae2"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-21T00:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-21T00:00:00Z"
 *                     totalDocs:
 *                       type: integer
 *                       example: 50
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving authors
 *                 data:
 *                   type: null
 */
authorRoute.post('/complex-get',authorController.selfQueryAuthor);
export default authorRoute;
