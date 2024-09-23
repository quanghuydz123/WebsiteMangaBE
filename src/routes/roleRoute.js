const express = require('express');
const roleRouter = express.Router();
const roleController = require('../controller/RoleController');

roleRouter.post('/create-many-role',roleController.createManyRole)


module.exports = roleRouter