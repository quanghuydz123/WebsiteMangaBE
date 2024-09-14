const asyncHandle = require('express-async-handler')
require('dotenv').config()

const getAll = asyncHandle( async (req, res) => {
    res.send("abc")
})

module.exports = {
    getAll,
}