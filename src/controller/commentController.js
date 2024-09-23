const asyncHandle = require('express-async-handler')
require('dotenv').config()
const CommentModel = require("../models/CommentModel")
const mongoose = require('mongoose'); 

const createManyComment = asyncHandle( async (req, res) => {
    const {tb_Comment} = req.body
    await Promise.all(tb_Comment.map(async (comment)=>{
        await CommentModel.create({
            ...comment,
            _id: new mongoose.Types.ObjectId(comment._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyComment,
}