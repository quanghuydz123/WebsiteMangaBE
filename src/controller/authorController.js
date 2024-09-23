const asyncHandle = require('express-async-handler')
require('dotenv').config()
const AuthorModel = require("../models/AuthorModel")
const mongoose = require('mongoose'); 

const createManyAuthor = asyncHandle( async (req, res) => {
    const {tb_Author} = req.body
    await Promise.all(tb_Author.map(async (author)=>{
        await AuthorModel.create({
            ...author,
            _id: new mongoose.Types.ObjectId(author._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyAuthor,
}