const express = require('express');
const genreRoute = express.Router();
const genreController = require("../controller/genreController")

genreRoute.post('/create-many-genre',genreController.createManyGenre)


module.exports = genreRoute