import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import commentController from '../controller/commentController';
import { authenticateJWT, authUserMiddleWare } from '../middlewares/authMiddleware';

const commentRoute = express.Router();

commentRoute.post('/create-many-comment',authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    commentController.createManyComment(req, res,next);
});

/**
 * @swagger
 * /comments/get-page:
 *   get:
 *     summary: Get paginated comments
 *     tags: [Comments]
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
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: Paginated comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalComment:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 Comment:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error retrieving comments
 */

commentRoute.get('/get-page',commentController.getPaginatedComment);
/**
 * @swagger
 * /comments/get-advanced-page:
 *   get:
 *     summary: Get paginated comments with filters
 *     tags: [Comments]
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
 *         description: Number of comments per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           default: "_id,text"
 *           description: Fields to include in response, comma separated (e.g., "user,text")
 *          
 *     responses:
 *       200:
 *         description: Paginated filtered comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalComments:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error retrieving comments
 */

commentRoute.get('/get-advanced-page',commentController.getAdvancedPaginatedComment);
/**
 * @swagger
 * /comments/create:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "603d1a231f1f1c001c8e4e84"
 *               text:
 *                 type: string
 *                 example: "This is a great manga!"
 *               manga:
 *                 type: string
 *                 example: "603d1a231f1f1c001c8e4e85"
 *               isReturnNewData:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Comment created successfully
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
 *                   example: "Comment created successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

commentRoute.post('/create', authUserMiddleWare, commentController.createComment);
/**
 * @swagger
 * /comments/update:
 *   put:
 *     summary: Update a comment's text or status.
 *     description: Updates a comment's text and deletion status. Validates text content to prevent toxic language. Returns the updated comment if requested.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the comment to be updated.
 *           example: "64f5c1c7e4b0c2345b9e8a9d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Updated text for the comment. Will be checked for inappropriate language.
 *                 example: "Updated comment text"
 *               isDeleted:
 *                 type: boolean
 *                 description: Indicates if the comment should be marked as deleted.
 *                 example: false
 *               isReturnNewData:
 *                 type: boolean
 *                 description: Specifies if the updated comment data should be returned in the response.
 *                 example: true
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully."
 *                 data:
 *                   type: object
 *                   description: Updated comment data, if isReturnNewData is true.
 *                   example: { "_id": "64f5c1c7e4b0c2345b9e8a9d", "text": "Updated comment text", "isDeleted": false }
 *       403:
 *         description: Text violates community standards.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "vi phạm tiêu chuẩn cộng đồng"
 *                 data:
 *                   type: null
 *       404:
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment not found."
 *                 data:
 *                   type: null
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error: <error message>"
 *                 data:
 *                   type: null
 */


commentRoute.put('/update',commentController.updateComment);

/**
 * @swagger
 * /comments/get-comment-section-for-manga:
 *   get:
 *     summary: Get paginated comments for a specific manga
 *     tags: [Comments]
 *     description: Retrieves comments for a given manga, with pagination and user details included.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the manga for which to retrieve comments.
 *         schema:
 *           type: string
 *           example: "60b8c4e5c2f4b52a9c8f1e4c"
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
 *         description: The number of comments per page (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A successful response with paginated comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                 totalComment:
 *                   type: integer
 *                   description: The total number of comments for the manga.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages available.
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _idComment:
 *                         type: string
 *                         description: The ID of the comment.
 *                       userName:
 *                         type: string
 *                         description: The name of the user who made the comment.
 *                       text:
 *                         type: string
 *                         description: The content of the comment.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the comment was last updated.
 *       400:
 *         description: Invalid manga ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid manga ID format."
 *       500:
 *         description: Server error while retrieving comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving comments"
 *                 error:
 *                   type: object
 *                   description: Detailed error information.
 */
commentRoute.get('/get-comment-section-for-manga',commentController.getPaginatedCommentForManga);

/**
 * @swagger
 * /comments/delete-commentById:
 *   delete:
 *     summary: delete comment by id
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idComment:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:   
 *         description: delete success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 'Xóa thành công'
 *       500:
 *         description: Internal server error
 * 
 * */
commentRoute.delete('/delete-commentById',commentController.deleteComment);

export default commentRoute;
