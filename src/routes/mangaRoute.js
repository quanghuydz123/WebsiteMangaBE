const express = require('express');
const mangaRoute = express.Router();
const mangaController = require("../controller/mangaController")

mangaRoute.post('/create-many-manga',mangaController.createManyManga)
mangaRoute.get('/get-all',mangaController.getAll)

module.exports = mangaRoute