const express = require('express');
const chapterRoute = express.Router();
const chapterController = require("../controller/chapterController")

chapterRoute.post('/create-many-chapter',chapterController.createManyChapter)


module.exports = chapterRoute