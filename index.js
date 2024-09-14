const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
const connectDb = require('./src/configs/connectDb')
const routes = require('./src/routes')
const errorMiddleHandle = require('./src/middlewares/errorMiddlewares')
require('dotenv').config()
app.use(cors())
app.use(express.json())
routes(app)
app.use(errorMiddleHandle)

const http = require("http").Server(app);

connectDb.connectDb()

http.listen(port,()=>{
    console.log("Sever is running in port: " + port )
})