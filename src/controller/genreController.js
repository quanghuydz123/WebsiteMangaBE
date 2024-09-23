const asyncHandle = require('express-async-handler')
require('dotenv').config()
const GenreModel = require("../models/GenreModel")
const mongoose = require('mongoose'); 

const createManyGenre = asyncHandle( async (req, res) => {
    const {tb_Genre} = req.body
    await Promise.all(tb_Genre.map(async (genre)=>{
        await GenreModel.create({
            ...genre,
            _id: new mongoose.Types.ObjectId(genre._id),
        })
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyGenre,
}