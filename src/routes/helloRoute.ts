import { Router } from 'express';
import { importAllData } from '../controller/initDatabaseController';

const router = Router();

// Define a GET route at the root of /hello
router.get('/', (req, res) => {
    res.send('Hello World!');
});

/**
 * @swagger
 * /hello/import-all:
 *   post:
 *     summary: Import all data from database.json into MongoDB
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Data imported successfully
 *       500:
 *         description: Internal server error
 */
router.post('/import-all', importAllData);

export default router;
