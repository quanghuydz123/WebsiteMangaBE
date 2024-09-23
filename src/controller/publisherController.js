const asyncHandle = require('express-async-handler')
require('dotenv').config()
const PublisherModel = require("../models/PublisherModel")
const mongoose = require('mongoose'); 

const createManyPublisher = asyncHandle( async (req, res) => {
    const {tb_Publisher} = req.body
    await Promise.all(tb_Publisher.map(async (publisher)=>{
        await PublisherModel.create({
            ...publisher,
            _id: new mongoose.Types.ObjectId(publisher._id),
        })
        
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
    })
})

module.exports = {
    createManyPublisher,
}