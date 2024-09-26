import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import followingController from '../controller/followingController';

const followingRoute = express.Router();

followingRoute.post('/create-many-following', (req: Request, res: Response, next: NextFunction) => {
    followingController.createManyFollowing(req, res, next);
});

/**
 * @swagger
 * /followings/get-page:
 *   get:
 *     summary: Get paginated followings
 *     tags: [Followings]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A paginated list of followings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalFollowings:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 followings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Following'
 *       500:
 *         description: Internal server error
 */

followingRoute.get('/get-page', followingController.getPaginatedFollowing);
/**
 * @swagger
 * /followings/get-advanced-page:
 *   get:
 *     summary: Get advanced paginated followings
 *     tags: [Followings]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: filter
 *         required: false
 *         description: Comma-separated list of fields to include in the response
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of followings with filtering
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalFollowings:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 followings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Following'
 *       500:
 *         description: Internal server error
 */
followingRoute.get('/get-advanced-page', followingController.getAdvancedPaginatedFollowing);
/**
 * @swagger
 * /followings/create:
 *   post:
 *     summary: Create a following
 *     tags: [Followings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user ID
 *               manga:
 *                 type: string
 *                 description: The manga ID
 *               isReturnNewData:
 *                 type: boolean
 *                 description: Return new following data if true
 *     responses:
 *       201:
 *         description: Following created successfully
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
 *                   $ref: '#/components/schemas/Following'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
followingRoute.post('create', followingController.createFollowing);
/**
 * @swagger
 * /followings/update/{id}:
 *   put:
 *     summary: Update a following
 *     tags: [Followings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The following ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user ID
 *               manga:
 *                 type: string
 *                 description: The manga ID
 *               isReturnNewData:
 *                 type: boolean
 *                 description: Return updated following data if true
 *     responses:
 *       200:
 *         description: Following updated successfully
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
 *                   $ref: '#/components/schemas/Following'
 *       404:
 *         description: Following not found
 *       500:
 *         description: Internal server error
 */


followingRoute.put('/update/:id', followingController.updateFollowing);

/**
 * @swagger
 * /followings/delete/{id}:
 *   delete:
 *     summary: Delete a following
 *     tags: [Followings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the following to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Following deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Following not found
 *       500:
 *         description: Internal server error
 */
followingRoute.delete('/delete/:id', followingController.deleteFollowing);
/**
 * @swagger
 * /followings/get-library:
 *   get:
 *     summary: Get paginated followed mangas with latest chapters
 *     tags: [Followings]
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the user
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
 *         description: A paginated list of followed mangas with latest chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page number
 *                 totalFollowings:
 *                   type: integer
 *                   description: Total number of followings
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages available
 *                 followings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: uuid
 *                         description: Unique identifier for the following record
 *                       idManga:
 *                         type: string
 *                         format: uuid
 *                         description: Unique identifier for the manga
 *                       mangaName:
 *                         type: string
 *                         description: The name of the manga
 *                       mangaImageUrl:
 *                         type: string
 *                         description: The URL of the manga image
 *                       latestChapterId:
 *                         type: string
 *                         format: uuid
 *                         description: Unique identifier for the latest chapter
 *                       latestChapterTitle:
 *                         type: string
 *                         description: Title of the latest chapter
 *                       latestChapterCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the latest chapter
 *       500:
 *         description: Server error
 */
followingRoute.get('/get-library',followingController.getUserLibrary);
export default followingRoute;
