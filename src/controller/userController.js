const asyncHandle = require('express-async-handler')
require('dotenv').config()
const UserModel = require("../models/UserModel")
const mongoose = require('mongoose');
const getAll = asyncHandle( async (req, res) => {
   
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

const createManyUser = asyncHandle( async (req, res) => {
    const {tb_User} = req.body
    const userNews = []
    await Promise.all(tb_User.map(async (user)=>{
        console.log(user)
        const userNew = await UserModel.create({
            ...user,
            _id: new mongoose.Types.ObjectId(user._id),
        })
        if(userNew){
            userNews.push(userNew)
        }
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
        userNews
    })
})

module.exports = {
    getAll,
    createManyUser
}