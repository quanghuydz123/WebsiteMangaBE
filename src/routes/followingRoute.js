const express = require('express');
const followingRoute = express.Router();
const followingController = require("../controller/followingController")

followingRoute.post('/create-many-following',followingController.createManyFollowing)


module.exports = followingRoute