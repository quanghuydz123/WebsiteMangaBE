"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorController_1 = __importDefault(require("../controller/authorController"));
const authorRoute = express_1.default.Router();
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
authorRoute.post('/create-many-author', (req, res, next) => {
    authorController_1.default.createManyAuthor(req, res, next);
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
authorRoute.get('/get-advanced-page', authorController_1.default.getAdvancedPaginatedAuthor);
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
authorRoute.get('/get-page', authorController_1.default.getPaginatedAuthor);
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
authorRoute.post('/create', authorController_1.default.createAuthor);
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
authorRoute.put('/update', authorController_1.default.updateAuthor);
/**
 * @swagger
 * /authors/complex-get:
 *   post:
 *     summary: Retrieve a paginated list of authors with filters and pagination options (Lấy danh sách tác giả phân trang với bộ lọc và tùy chọn phân trang)
 *     tags:
 *       - Author
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
 *                   name:
 *                     type: string
 *                     description: Filter authors by name (case-insensitive). (Lọc tác giả theo tên, không phân biệt chữ hoa chữ thường.)
 *                     example: John
 *                   isDeleted:
 *                     type: boolean
 *                     description: Filter authors by deletion status. (Lọc tác giả theo trạng thái đã bị xóa.)
 *                     example: false
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
 *                     example: ["name", "createAt", "updatedAt"]
 *                   lean:
 *                     type: boolean
 *                     description: Return plain JavaScript objects instead of Mongoose documents. (Trả về các đối tượng JavaScript thuần thay vì các tài liệu Mongoose.)
 *                     example: true
 *                   leanWithId:
 *                     type: boolean
 *                     description: Include `_id` field in plain JS objects. (Bao gồm trường `_id` trong các đối tượng JavaScript thuần.)
 *                     example: false
 *     responses:
 *       200:
 *         description: A paginated list of authors based on the provided filters and options. (Danh sách tác giả phân trang dựa trên các bộ lọc và tùy chọn đã cung cấp.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *                   description: Array of author documents. (Mảng các tài liệu tác giả.)
 *                 totalDocs:
 *                   type: integer
 *                   description: The total number of authors. (Tổng số tác giả.)
 *                 limit:
 *                   type: integer
 *                   description: The number of authors per page. (Số tác giả trên mỗi trang.)
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
authorRoute.post('/complex-get', authorController_1.default.selfQueryAuthor);
exports.default = authorRoute;
