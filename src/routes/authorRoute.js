const express = require('express');
const authorRoute = express.Router();
const authorController = require("../controller/authorController")

authorRoute.post('/create-many-author',authorController.createManyAuthor)


module.exports = authorRoute