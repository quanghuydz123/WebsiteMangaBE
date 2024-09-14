const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

userRouter.get('/get-all',userController.getAll)


module.exports = userRouter