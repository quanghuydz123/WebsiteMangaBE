const express = require('express');
const notificationRoute = express.Router();
const notificationController = require("../controller/notificationController")

notificationRoute.post('/create-many-notification',notificationController.createManyNotification)


module.exports = notificationRoute