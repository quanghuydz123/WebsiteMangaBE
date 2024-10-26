
import fileController from '../controller/fileController';
import express from 'express';

const fileRouter = express.Router();

/**
 * @swagger
 * /files/create:
 *   post:
 *     summary: Create a new file
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [image, folder]
 *               parentId:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: File created successfully
 *       500:
 *         description: Error creating file
 */
fileRouter.post('/create', fileController.createFile);

/**
 * @swagger
 * /files/create-folder:
 *   post:
 *     summary: Create a new file or folder
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: File created successfully
 *       500:
 *         description: Error creating file
 */
fileRouter.post('/create-folder', fileController.createFolder);
/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get all files from a folder
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: Folder path
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
 *         description: List of files
 *       500:
 *         description: Error retrieving files
 */
fileRouter.get('/', fileController.getFiles);

/**
 * @swagger
 * /files/find:
 *   get:
 *     summary: Get files based on a similar name from a specific folder
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to search for (case-insensitive). Will be trimmed to avoid empty strings.
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: ID of the parent folder.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of files to return per page.
 *     responses:
 *       200:
 *         description: A list of files matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: File ID
 *                       name:
 *                         type: string
 *                         description: File name
 *                       type:
 *                         type: string
 *                         description: File type
 *                       isDeleted:
 *                         type: boolean
 *                         description: Indicates if the file is deleted
 *                       data:
 *                         type: string
 *                         description: File data
 *                 totalDocs:
 *                   type: integer
 *                   description: Total number of documents
 *                 limit:
 *                   type: integer
 *                   description: Limit used for pagination
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *       400:
 *         description: Name cannot be empty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error retrieving files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
fileRouter.get('/find', fileController.getFilesByName);


/**
 * @swagger
 * /files/move:
 *   patch:
 *     summary: Move a file or folder to another location
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *               destinationId:
 *                 type: string
 *             required:
 *               - fileId
 *               - destinationId
 *     responses:
 *       200:
 *         description: File moved successfully
 *       500:
 *         description: Error moving file
 */
fileRouter.patch('/move', fileController.moveFile);

/**
 * @swagger
 * /files/delete:
 *   delete:
 *     summary: Delete a file or folder
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       500:
 *         description: Error deleting file
 */
fileRouter.delete('/delete', fileController.deleteFile);

/**
 * @swagger
 * /files/restore:
 *   patch:
 *     summary: Restore a deleted file or folder
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the file to restore
 *     responses:
 *       200:
 *         description: File restored successfully
 *       500:
 *         description: Error restoring file
 */
fileRouter.patch('/restore', fileController.restoreFile);

/**
 * @swagger
 * /files/deleted:
 *   get:
 *     summary: Get a list of deleted files
 *     tags: [File]
 *     responses:
 *       200:
 *         description: List of deleted files
 *       500:
 *         description: Error retrieving deleted files
 */
fileRouter.get('/deleted', fileController.getDeletedFiles);

/**
 * @swagger
 * /files/create-image-from-link:
 *   post:
 *     summary: Create an image from a URL link
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *             required:
 *               - link
 *               - name
 *     responses:
 *       201:
 *         description: Image created successfully
 *       500:
 *         description: Error creating image from link
 */
fileRouter.post('/create-image-from-link', fileController.createImageFromLink);

/**
 * @swagger
 * /files/image:
 *   get:
 *     summary: Get image data for use in <img> tags
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the image to retrieve
 *     responses:
 *       200:
 *         description: Image data
 *       404:
 *         description: Image not found
 *       500:
 *         description: Error retrieving image
 */
fileRouter.get('/image', fileController.getImageForHTMLImgTag);

/**
 * @swagger
 * /files/images:
 *   get:
 *     summary: Get paginated list of images from a folder
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         required: true
 *         description: Folder path
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit of images per page
 *     responses:
 *       200:
 *         description: List of paginated images
 *       500:
 *         description: Error retrieving images
 */
fileRouter.get('/images', fileController.getImagesFromFolderPaginate);

/**
 * @swagger
 * /files/convert-computer-images-to-link:
 *   post:
 *     summary: Converts local computer images to links in the specified manga and chapter.
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterTitle:
 *                 type: string
 *                 description: The title of the chapter.
 *                 example: "Chapter 1: The Beginning"
 *               mangaName:
 *                 type: string
 *                 description: The name of the manga.
 *                 example: "My Manga"
 *               arrayOfImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The filenames or paths of the images to be converted.
 *                   example: ["image1.jpg", "image2.png"]
 *     responses:
 *       201:
 *         description: Successfully created files, returns an array of file IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message about file creation.
 *                   example: "Files created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: The IDs of the created files.
 *                         example: ["/files/image?fileId=60f7f0e4b4b7d401c0e55c16", "/files/image?fileId=60f7f0e4b4b7d401c0e55c17"]
 *                     invalidFiles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: The filenames that were not processed due to invalid extensions.
 *                         example: ["invalidFile.txt"]
 *       400:
 *         description: Bad request when required fields are missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating what was wrong with the request.
 *                   example: "Manga name, chapter title, and images are required."
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error when file creation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure.
 *                   example: "Unable to create files."
 *                 data:
 *                   type: null
 */

fileRouter.post('/convert-computer-images-to-link',fileController.convertComputerImagesToLink)
export default fileRouter;