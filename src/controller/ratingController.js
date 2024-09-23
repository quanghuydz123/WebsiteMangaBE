const asyncHandle = require('express-async-handler')
require('dotenv').config()
const RatingModel = require("../models/RatingModel")
const mongoose = require('mongoose'); 

const createManyRating = asyncHandle( async (req, res) => {
    const {tb_Rating} = req.body
    await Promise.all(tb_Rating.map(async (rating)=>{
        await RatingModel.create({
            ...rating,
            _id: new mongoose.Types.ObjectId(rating._id),
        })
        
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyRating,
}