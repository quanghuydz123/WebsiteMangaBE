const express = require('express');
const roleRouter = express.Router();
const roleController = require('../controller/RoleController');

roleRouter.post('/create-role',roleController.createRoleID)


module.exports = roleRouter