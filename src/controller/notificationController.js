const asyncHandle = require('express-async-handler')
require('dotenv').config()
const NotificationModel = require("../models/NotificationModel")
const mongoose = require('mongoose'); 

const createManyNotification = asyncHandle( async (req, res) => {
    const {tb_Notification} = req.body
    await Promise.all(tb_Notification.map(async (notification)=>{
        await NotificationModel.create({
            ...notification,
            _id: new mongoose.Types.ObjectId(notification._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyNotification,
}