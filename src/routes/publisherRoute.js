const express = require('express');
const publisherRoute = express.Router();
const publisherController = require("../controller/publisherController")

publisherRoute.post('/create-many-publisher',publisherController.createManyPublisher)


module.exports = publisherRoute