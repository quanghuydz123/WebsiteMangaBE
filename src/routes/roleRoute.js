const express = require('express');
const roleRouter = express.Router();
const roleController = require('../controller/RoleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     roles:
 *       type: object
 *       description: Các quyền trong hệ thống
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of your role
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the role was added
 *         updatedAt:   # Corrected this typo from "updateAt" to "updatedAt"
 *           type: string
 *           format: date
 *           description: The date the role was last updated
 */


roleRouter.post('/create-many-role',roleController.createManyRole)


module.exports = roleRouter