import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import mangaController from '../controller/mangaController';

const mangaRoute = express.Router();

mangaRoute.post('/create-many-manga', (req: Request, res: Response, next: NextFunction) => {
    mangaController.createManyManga(req, res, next);
});

mangaRoute.get('/get-all', (req: Request, res: Response, next: NextFunction) => {
    mangaController.getAll(req, res, next);
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
 *         description: sắp xếp truyện từ a-z(ascName), z-a (descName), truyện mới nhất (latest-story),xem nhiều nhất (most-viewed),theo dõi giảm dần (follow),đánh giá giảm dần (star)
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

mangaRoute.get('/get-manga-byid', (req: Request, res: Response, next: NextFunction) => {
    mangaController.getMangaById(req, res, next);
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


mangaRoute.put('/update-manga-byid', (req: Request, res: Response, next: NextFunction) => {
    mangaController.updateMangaById(req, res, next);
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
mangaRoute.post('/create-manga', (req: Request, res: Response, next: NextFunction) => {
    mangaController.createManga(req, res, next);
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

mangaRoute.put('/increase-view', (req: Request, res: Response, next: NextFunction) => {
    mangaController.increaseView(req, res, next);
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

/**
 * @swagger
 * /manga/get-posters:
 *   get:
 *     summary: Retrieve manga posters with filters and pagination
 *     description: Fetches manga posters based on optional filters such as genre, author, publisher, and sorting options. Supports pagination.
 *     tags: [Manga]
 *     parameters:
 *       - in: query
 *         name: searchValue
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term for filtering manga by name
 *       - in: query
 *         name: fillterGenre
 *         required: false
 *         schema:
 *           type: string
 *         description: Genre to filter manga
 *       - in: query
 *         name: fillterAuthor
 *         required: false
 *         schema:
 *           type: string
 *         description: Author to filter manga
 *       - in: query
 *         name: fillterPublisher
 *         required: false
 *         schema:
 *           type: string
 *         description: Publisher to filter manga
 *       - in: query
 *         name: sortType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ascName, descName, latest-story, most-viewed, follow, star]
 *         description: Sort order for the manga list
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
 *           default: 20
 *         description: Number of posters per page (default is 20)
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: integer
 *         description: Status filter for manga
 *     responses:
 *       200:
 *         description: Successful response with a list of manga posters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           status:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Manga Title"
 *                     totalDocs:
 *                       type: integer
 *                       example: 100
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad request due to invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid query parameters
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching posters
 *                 data:
 *                   type: null
 *                   example: null
 */
mangaRoute.get('/get-posters', mangaController.getPosters);


mangaRoute.get('/statistics-view', mangaController.StatisticsByView);
/**
 * @swagger
 * /manga/statistics-view:
 *   get:
 *     summary: statistics manga by view
 *     tags: [Manga]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: page (mặc dịnh là 1)
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: limit (mặc định là 10)
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

mangaRoute.get('/statistics-follow', mangaController.StatisticsByFollow);
/**
 * @swagger
 * /manga/statistics-follow:
 *   get:
 *     summary: statistics manga by follow
 *     tags: [Manga]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: page (mặc dịnh là 1)
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: limit (mặc định là 10)
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
mangaRoute.get('/statistics-rating', mangaController.StatisticsByRating);
/**
 * @swagger
 * /manga/statistics-rating:
 *   get:
 *     summary: statistics manga by rating
 *     tags: [Manga]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: page (mặc dịnh là 1)
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: limit (mặc định là 10)
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

mangaRoute.put('/delete-manga', (req: Request, res: Response, next: NextFunction) => {
    mangaController.deleteManga(req, res, next);
});

/**
 * @swagger
 * /manga/delete-manga:
 *   put:
 *     summary: delete manga manga by id
 *     tags: [Manga]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idManga:
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

mangaRoute.get('/get-all-admin', mangaController.getAllAdminManga);
/**
 * @swagger
 * /manga/get-all-admin:
 *   get:
 *     summary: Retrieve a paginated list of mangas
 *     description: Get all manga entries with pagination, including author names and genre names. 
 *                  Returns a response wrapped in a `GenericResponse<MangaResponse[]>`.
 *     tags:
 *       - Manga
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated list of mangas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mangas retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _d:
 *                         type: string
 *                         example: "734895u345893759"
 *                       name:
 *                         type: string
 *                         example: "My Manga Title"
 *                       summary:
 *                         type: string
 *                         example: "A captivating summary of the manga story."
 *                       imageUrl:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                       authorName:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Author Name 1", "Author Name 2"]
 *                       genreName:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Genre 1", "Genre 2"]
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-02T00:00:00Z"
 *       500:
 *         description: Error retrieving mangas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving mangas
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */



mangaRoute.put('/update-by-id', mangaController.updateAdminManga)
/**
 * @swagger
 * /manga/update-by-id:
 *   put:
 *     summary: Update a manga entry by its ID
 *     description: Updates a manga entry in the database using the provided `_id` and `updatedData` in the request body. 
 *                  Returns the updated manga data in a `GenericResponse<MangaResponse>`.
 *     tags:
 *       - Manga
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The unique identifier of the manga to update.
 *                 example: "60c72b2f9e1b2c6d88e2f5e8"
 *               updatedData:
 *                 type: object
 *                 description: The data to update in the manga entry.
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "New Manga Title"
 *                   summary:
 *                     type: string
 *                     example: "Updated summary of the manga."
 *                   imageUrl:
 *                     type: string
 *                     example: "http://example.com/new-image.jpg"
 *                   isDeleted:
 *                     type: boolean
 *                     example: false
 *     responses:
 *       200:
 *         description: Successfully updated the manga entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Manga updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "New Manga Title"
 *                     summary:
 *                       type: string
 *                       example: "Updated summary of the manga."
 *                     imageUrl:
 *                       type: string
 *                       example: "http://example.com/new-image.jpg"
 *                     authorName:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Author Name 1"]
 *                     genreName:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Genre 1", "Genre 2"]
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-02T00:00:00Z"
 *       400:
 *         description: Missing `_id` or `updatedData` in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "_id and updatedData are required"
 *                 data:
 *                   type: null
 *       404:
 *         description: Manga not found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Manga not found"
 *                 data:
 *                   type: null
 *       500:
 *         description: Error updating the manga entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating manga"
 *                 data:
 *                   type: string
 *                   example: "{}"
 */

mangaRoute.get('/total-manga', (req: Request, res: Response, next: NextFunction) => {
    mangaController.totalManga(req, res, next);
});
/**
 * @swagger
 * tags:
 *   name: Manga
 *   description: get total manga
 * /manga/total-manga:
 *   get:
 *     summary: get total manga
 *     tags: [Manga]
 *     responses:
 *       200:   
 *         description: get total manga
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
export default mangaRoute;
