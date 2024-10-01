"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const initDatabaseController_1 = require("../controller/initDatabaseController");
const router = (0, express_1.Router)();
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
router.post('/import-all', initDatabaseController_1.importAllData);
exports.default = router;
