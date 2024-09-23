const asyncHandle = require('express-async-handler')
require('dotenv').config()
const RoleModel = require("../models/RoleModel")
const mongoose = require('mongoose'); 

const createManyRole = asyncHandle( async (req, res) => {
    const {roles} = req.body
    const roleNews = []
    await Promise.all(roles.map(async (role)=>{
        const roleNew = await RoleModel.create({
            _id: new mongoose.Types.ObjectId(role._id),
            name:role.name
        })
        if(roleNew){
            roleNews.push(roleNew)
        }
    }))
    res.status(200).json({
        status:200,
        message:"Thành công",
        roleNews
    })
})

module.exports = {
    createManyRole,
}