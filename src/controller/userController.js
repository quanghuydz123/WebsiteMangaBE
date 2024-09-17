const asyncHandle = require('express-async-handler')
require('dotenv').config()

const getAll = asyncHandle( async (req, res) => {
    res.status(200).json({
        status:200,
        message:"Thành công"
    })
})

module.exports = {
    getAll,
}