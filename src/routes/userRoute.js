const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

userRouter.get('/get-all',userController.getAll)
userRouter.post('/create-many-user',userController.createManyUser)


module.exports = userRouter