const asyncHandle = require('express-async-handler')
require('dotenv').config()
const mongoose = require('mongoose'); 
const MangaModel = require('../models/MangaModel')
const createManyManga = asyncHandle( async (req, res) => {
    const {tb_Manga} = req.body
    await Promise.all(tb_Manga.map(async (manga)=>{
        await MangaModel.create({
            ...manga,
            _id: new mongoose.Types.ObjectId(manga._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

const getAll = asyncHandle( async (req, res) => {
    const manga = await MangaModel.find().populate('author')
    res.status(200).json({
        status:200,
        message:"Thành công",
        manga
    })
})

module.exports = {
    createManyManga,
    getAll
}