const asyncHandle = require('express-async-handler')
require('dotenv').config()
const FollowingModel = require("../models/FollowingModel")
const mongoose = require('mongoose'); 

const createManyFollowing = asyncHandle( async (req, res) => {
    const {tb_Following} = req.body
    await Promise.all(tb_Following.map(async (following)=>{
        await FollowingModel.create({
            ...following,
            _id: new mongoose.Types.ObjectId(following._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyFollowing,
}