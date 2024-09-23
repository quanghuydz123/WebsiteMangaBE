const express = require('express');
const ratingRoute = express.Router();
const ratingController = require("../controller/ratingController")

ratingRoute.post('/create-many-rating',ratingController.createManyRating)


module.exports = ratingRoute