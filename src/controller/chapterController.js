const asyncHandle = require('express-async-handler')
require('dotenv').config()
const ChapterModel = require("../models/ChapterModel")
const mongoose = require('mongoose'); 

const createManyChapter = asyncHandle( async (req, res) => {
    const {tb_Chapter} = req.body
    await Promise.all(tb_Chapter.map(async (chapter)=>{
        await ChapterModel.create({
            ...chapter,
            _id: new mongoose.Types.ObjectId(chapter._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyChapter,
}