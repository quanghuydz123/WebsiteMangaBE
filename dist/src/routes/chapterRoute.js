"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chapterController_1 = __importDefault(require("../controller/chapterController"));
const chapterRoute = express_1.default.Router();
chapterRoute.post('/create-many-chapter', (req, res, next) => {
    chapterController_1.default.createManyChapter(req, res, next);
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
chapterRoute.get('/get-page', chapterController_1.default.getPaginatedChapters);
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
chapterRoute.get('/get-advanced-page', chapterController_1.default.getAdvancedPaginatedChapter);
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
chapterRoute.post('/append', chapterController_1.default.appendChapter);
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
chapterRoute.put('/update', chapterController_1.default.updateChapter);
/**
 * @swagger
  * /chapters/complex-get:
 *   post:
 *     summary: Retrieve a paginated list of chapters with filters and pagination options (Lấy danh sách chương phân trang với bộ lọc và tùy chọn phân trang)
 *     tags:
 *       - Chapters
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
chapterRoute.post('/complex-get', chapterController_1.default.selfQueryChapter);
exports.default = chapterRoute;
