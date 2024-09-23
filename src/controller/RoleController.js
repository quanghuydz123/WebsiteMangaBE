const asyncHandle = require('express-async-handler')
require('dotenv').config()
const RoleModel = require("../models/RoleModel")
const mongoose = require('mongoose'); 

const createRoleID = asyncHandle( async (req, res) => {
    const {_id,name} = req.body
    const user = await RoleModel.create({
        _id: new mongoose.Types.ObjectId(_id),
        name
    })
    res.status(200).json({
        status:200,
        message:"Thành công",
        user
    })
})

module.exports = {
    createRoleID,
}