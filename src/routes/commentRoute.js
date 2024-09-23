const express = require('express');
const commentRoute = express.Router();
const commentController = require("../controller/commentController")

commentRoute.post('/create-many-comment',commentController.createManyComment)


module.exports = commentRoute