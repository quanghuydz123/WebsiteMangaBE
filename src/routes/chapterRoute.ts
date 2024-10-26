import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import chapterController from '../controller/chapterController';

const chapterRoute = express.Router();
/**
 * @swagger
 * /chapters/create-many-chapter:
 *   post:
 *     summary: Create multiple chapters
 *     description: Deletes all existing chapters and creates new ones based on the provided list.
 *     tags:
 *       - Chapter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tb_Chapter:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Chapter ID (optional). If provided, must be a valid MongoDB ObjectId as a string.
 *                     title:
 *                       type: string
 *                       description: Title of the chapter.
 *                     content:
 *                       type: string
 *                       description: Content of the chapter.
 *     responses:
 *       200:
 *         description: Success - chapters created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *       400:
 *         description: Bad request - invalid input data.
 *       500:
 *         description: Internal server error.
 */
chapterRoute.post('/create-many-chapter', (req: Request, res: Response, next: NextFunction) => {
    chapterController.createManyChapter(req, res, next);
});
/**
 * @swagger
 * /chapters/get-page:
 *   get:
 *     tags: [Chapter]
 *     summary: Get paginated chapters
 *     description: Retrieves a paginated list of chapters for a specified manga ID.
 *     parameters:
 *       - name: mangaId
 *         in: query
 *         required: true
 *         description: The ID of the manga to retrieve chapters for.
 *         schema:
 *           type: string
 *           example: "60b8d95f1f10f14d4f0c9ae2"
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *           example: 2
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The number of chapters per page (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: orderType
 *         in: query
 *         required: false
 *         description: The order type for sorting chapters (ASC or DESC, default is DESC).
 *         schema:
 *           type: string
 *           example: "DESC"
 *     responses:
 *       200:
 *         description: Chapters retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapters retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 2
 *                     totalChapters:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     chapters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "60b8d95f1f10f14d4f0c9ae3"
 *                           title:
 *                             type: string
 *                             example: "Chapter 1"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-21T12:34:56Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving chapters
 *                 data:
 *                   type: null
 */
chapterRoute.get('/get-page', chapterController.getPaginatedChapters);
/**
 * @swagger
 * /chapters/get-advanced-page:
 *   get:
 *     tags: [Chapter]
 *     summary: Get advanced paginated chapters
 *     description: Retrieves a paginated list of chapters for a specified manga ID with advanced filtering options.
 *     parameters:
 *       - name: mangaId
 *         in: query
 *         required: true
 *         description: The ID of the manga to retrieve chapters for.
 *         schema:
 *           type: string
 *           example: "60b8d95f1f10f14d4f0c9ae2"
 *       - name: filter
 *         in: query
 *         required: false
 *         description: A comma-separated list of fields to include in the response.
 *         schema:
 *           type: string
 *           example: "title,updatedAt"
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *           example: 2
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The number of chapters per page (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Chapters retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapters retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 2
 *                     totalChapters:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     chapters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "60b8d95f1f10f14d4f0c9ae3"
 *                           title:
 *                             type: string
 *                             example: "Chapter 1"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-21T12:34:56Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving chapters
 *                 data:
 *                   type: null
 */
chapterRoute.get('/get-advanced-page', chapterController.getAdvancedPaginatedChapter);
/**
 * @swagger
 * /chapters/append:
 *   post:
 *     summary: Append a new chapter to a manga
 *     description: Creates a new chapter for a specified manga, assigning it the next chapter number based on the latest existing chapter. Optionally returns the newly created chapter data.
 *     tags:
 *       - Chapter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manga:
 *                 type: string
 *                 description: ID of the manga to which the chapter will be added
 *                 example: "60c72b1f4f1a256a5c9e9b01"
 *               title:
 *                 type: string
 *                 description: Title of the new chapter
 *                 example: "The Journey Begins"
 *               imageLinks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of image URLs for the chapter pages
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               isReturnNewData:
 *                 type: boolean
 *                 description: If true, the response includes the newly created chapter's details
 *                 example: true
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapter created successfully.
 *                 data:
 *                   type: object
 *                   description: Newly created chapter data (if isReturnNewData is true)
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b1f4f1a256a5c9e9b02"
 *                     manga:
 *                       type: string
 *                       example: "60c72b1f4f1a256a5c9e9b01"
 *                     title:
 *                       type: string
 *                       example: "Chapter - 1: The Journey Begins"
 *                     imageLinks:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                     chapterNum:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Manga and title are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manga and title are required.
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error Unable to create chapter.
 *                 data:
 *                   type: null
 *                   example: null
 */
chapterRoute.post('/append', chapterController.appendChapter);
/**
 * @swagger
 * /chapters/update:
 *   put:
 *     summary: Update an existing chapter
 *     description: Updates the details of a chapter based on its ID. Checks for unique chapterNum within the same manga before updating.
 *     tags:
 *       - Chapter
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chapter to update
 *         example: "60c72b1f4f1a256a5c9e9b02"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the chapter
 *                 example: "Updated Chapter Title"
 *               isDeleted:
 *                 type: boolean
 *                 description: Flag to mark the chapter as deleted
 *                 example: false
 *               imageLinks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated list of image URLs for the chapter pages
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               chapterNum:
 *                 type: integer
 *                 description: New chapter number
 *                 example: 5
 *               isReturnNewData:
 *                 type: boolean
 *                 description: If true, the response includes the updated chapter's details
 *                 example: true
 *     responses:
 *       200:
 *         description: Chapter updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapter updated successfully.
 *                 data:
 *                   type: object
 *                   description: Updated chapter data (if isReturnNewData is true)
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b1f4f1a256a5c9e9b02"
 *                     title:
 *                       type: string
 *                       example: "Updated Chapter Title"
 *                     imageLinks:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                     chapterNum:
 *                       type: integer
 *                       example: 5
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - chapterNum conflict or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapter number 5 already exists.
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapter not found.
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error Unable to update chapter.
 *                 data:
 *                   type: null
 *                   example: null
 */

chapterRoute.put('/update', chapterController.updateChapter);

/**
 * @swagger
  * /chapters/complex-get:
 *   post:
 *     summary: Retrieve a paginated list of chapters with filters and pagination options (Lấy danh sách chương phân trang với bộ lọc và tùy chọn phân trang)
 *     tags:
 *       - Chapter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 description: The page number to retrieve. (Số trang cần lấy.)
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: The number of results per page. (Số lượng kết quả trên mỗi trang.)
 *                 example: 10
 *               filter:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Filter chapters by title (case-insensitive). (Lọc chương theo tiêu đề, không phân biệt chữ hoa chữ thường.)
 *                     example: "The Dark Secret"
 *                   isDeleted:
 *                     type: boolean
 *                     description: Filter chapters by deletion status. (Lọc chương theo trạng thái đã bị xóa.)
 *                     example: false
 *                   manga:
 *                     type: string
 *                     description: Filter chapters by manga ID. (Lọc chương theo ID manga.)
 *                     example: "60c72b2f9b1e8c001c8e4a20"  # Example Manga ID
 *               options:
 *                 type: object
 *                 properties:
 *                   sort:
 *                     type: object
 *                     description: Sort order for the results. (Thứ tự sắp xếp cho kết quả.)
 *                     example: { "createAt": -1 }
 *                   select:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Fields to include in the result set. (Các trường cần bao gồm trong tập kết quả.)
 *                     example: ["title", "createAt", "updatedAt"]
 *                   lean:
 *                     type: boolean
 *                     description: Return plain JavaScript objects instead of Mongoose documents. (Trả về các đối tượng JavaScript thuần thay vì các tài liệu Mongoose.)
 *                     example: true
 *                   leanWithId:
 *                     type: boolean
 *                     description: Include `_id` field in plain JS objects. (Bao gồm trường `_id` trong các đối tượng JavaScript thuần.)
 *                     example: false
 *                   populate:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         path:
 *                           type: string
 *                           description: The field to populate. (Trường cần được populate.)
 *                           example: "manga"
 *                         select:
 *                           type: string
 *                           description: Fields to include from the populated document. (Các trường cần bao gồm từ tài liệu đã được populate.)
 *                           example: "title"
 *     responses:
 *       200:
 *         description: A paginated list of chapters based on the provided filters and options. (Danh sách chương phân trang dựa trên các bộ lọc và tùy chọn đã cung cấp.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chapter'
 *                   description: Array of chapter documents. (Mảng các tài liệu chương.)
 *                 totalDocs:
 *                   type: integer
 *                   description: The total number of chapters. (Tổng số chương.)
 *                 limit:
 *                   type: integer
 *                   description: The number of chapters per page. (Số chương trên mỗi trang.)
 *                 page:
 *                   type: integer
 *                   description: The current page number. (Số trang hiện tại.)
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages. (Tổng số trang.)
 *                 hasNextPage:
 *                   type: boolean
 *                   description: If there is a next page. (Có trang tiếp theo hay không.)
 *                 hasPrevPage:
 *                   type: boolean
 *                   description: If there is a previous page. (Có trang trước hay không.)
 *                 nextPage:
 *                   type: integer
 *                   description: The next page number (if it exists). (Số trang tiếp theo nếu có.)
 *                   example: 2
 *                 prevPage:
 *                   type: integer
 *                   description: The previous page number (if it exists). (Số trang trước nếu có.)
 *                   example: null
 *       500:
 *         description: Internal Server Error (Lỗi máy chủ nội bộ)
 */



chapterRoute.post('/complex-get', chapterController.selfQueryChapter);
/**
 * @swagger
 * /chapters/updateImageLink:
 *   post:
 *     summary: Update an image link at a specific position
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The ID of the chapter
 *               pos:
 *                 type: integer
 *                 description: The position of the image link to update
 *               newImageLink:
 *                 type: string
 *                 description: The new image link
 *     responses:
 *       200:
 *         description: Image link updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       404:
 *         description: Chapter not found or invalid position
 *       500:
 *         description: Server error
 */
chapterRoute.post('/updateImageLink', chapterController.updateImageLink);
/**
 * @swagger
 * /chapters/appendImageLink:
 *   post:
 *     summary: Append an image link to the list
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The ID of the chapter
 *               imageLinks:
 *                 type: string
 *                 description: The image link to append
 *     responses:
 *       200:
 *         description: Image link appended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */
chapterRoute.post('/appendImageLink', chapterController.appendImageLink);

/**
 * @swagger
 * /chapters/readImageLink:
 *   post:
 *     summary: Read an image link at a specific position
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The ID of the chapter
 *               pos:
 *                 type: integer
 *                 description: The position of the image link to read
 *     responses:
 *       200:
 *         description: Image link retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                   description: The image link
 *       404:
 *         description: Chapter not found or invalid position
 *       500:
 *         description: Server error
 */
chapterRoute.post('/readImageLink', chapterController.readImageLink);
/**
 * @swagger
 * /chapters/removeImageLink:
 *   post:
 *     summary: Remove an image link at a specific position
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The ID of the chapter
 *               pos:
 *                 type: integer
 *                 description: The position of the image link to remove
 *     responses:
 *       200:
 *         description: Image link removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       404:
 *         description: Chapter not found or invalid position
 *       500:
 *         description: Server error
 */
chapterRoute.post('/removeImageLink', chapterController.removeImageLink);
/**
 * @swagger
 * /chapters/insertImageLink:
 *   post:
 *     summary: Insert an image link at a specific position
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The ID of the chapter
 *               imageLinks:
 *                 type: string
 *                 description: The image link to insert
 *               pos:
 *                 type: integer
 *                 description: The position to insert the image link
 *     responses:
 *       200:
 *         description: Image link inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */
chapterRoute.post('/insertImageLink', chapterController.insertImageLink);
/**
 * @swagger
 * /chapters/get-list:
 *   get:
 *     summary: Get chapters by mangaId with pagination
 *     description: Retrieve a list of chapters for a given mangaId, with optional pagination. The chapters are sorted by title and createdAt in descending order.
 *     tags:
 *       - Chapter
 *     parameters:
 *       - in: query
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manga
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit of chapters per page (default is 10)
 *       - in: query
 *         name: orderType
 *         required: false
 *         schema:
 *           type: string
 *           default: 'DESC'
 *         description: order chapters by DESC or ASC
 *     responses:
 *       200:
 *         description: A successful response with a list of chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chapters retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "Chapter Title"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T00:00:00Z"
 *                           _id:
 *                             type: string
 *                             example: "6123456789abcdef12345678"
 *                     totalDocs:
 *                       type: integer
 *                       example: 100
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pagingCounter:
 *                       type: integer
 *                       example: 1
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request, missing or invalid mangaId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: mangaId is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching chapters
 *                 data:
 *                   type: null
 *                   example: null
 */

chapterRoute.get('/get-list', chapterController.getChapterListByMangaId);

/**
 * @swagger
 * /chapters/next:
 *   get:
 *     summary: Retrieve the next chapter of a manga
 *     description: Fetches the next chapter of a specified manga based on the provided chapter number. Returns the next chapter with a higher chapter number if it exists.
 *     tags:
 *       - Chapter
 *     parameters:
 *       - in: query
 *         name: mangaId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the manga
 *         example: "60c72b1f4f1a256a5c9e9b01"
 *       - in: query
 *         name: chapterNum
 *         schema:
 *           type: integer
 *         required: true
 *         description: The current chapter number to find the next chapter for
 *         example: 3
 *     responses:
 *       200:
 *         description: Next chapter retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Next chapter retrieved successfully.
 *                 data:
 *                   type: object
 *                   description: Details of the next chapter
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b1f4f1a256a5c9e9b02"
 *                     chapterNum:
 *                       type: integer
 *                       example: 4
 *                     title:
 *                       type: string
 *                       example: "Chapter - 4: The Adventure Continues"
 *                     imageLinks:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *       400:
 *         description: Bad Request - mangaId and chapterNum are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: mangaId and chapterNum are required.
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Next chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Next chapter not found.
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching next chapter.
 *                 data:
 *                   type: null
 *                   example: null
 */

chapterRoute.get('/next', chapterController.getNextChapter);
/**
 * @swagger
 * /chapters/previous:
 *   get:
 *     summary: Retrieve the previous chapter of a manga
 *     description: Fetches the previous chapter of a specified manga based on the provided chapter number. Returns the previous chapter with a lower chapter number if it exists.
 *     tags:
 *       - Chapter
 *     parameters:
 *       - in: query
 *         name: mangaId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the manga
 *         example: "60c72b1f4f1a256a5c9e9b01"
 *       - in: query
 *         name: chapterNum
 *         schema:
 *           type: integer
 *         required: true
 *         description: The current chapter number to find the previous chapter for
 *         example: 4
 *     responses:
 *       200:
 *         description: Previous chapter retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Previous chapter retrieved successfully.
 *                 data:
 *                   type: object
 *                   description: Details of the previous chapter
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b1f4f1a256a5c9e9b02"
 *                     chapterNum:
 *                       type: integer
 *                       example: 3
 *                     title:
 *                       type: string
 *                       example: "Chapter - 3: The Journey Begins"
 *                     imageLinks:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *       400:
 *         description: Bad Request - mangaId and chapterNum are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: mangaId and chapterNum are required.
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Previous chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Previous chapter not found.
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching previous chapter.
 *                 data:
 *                   type: null
 *                   example: null
 */


chapterRoute.get('/previous', chapterController.getPreviousChapter);
export default chapterRoute;