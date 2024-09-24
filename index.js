const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
const connectDb = require('./src/configs/connectDb')
const routes = require('./src/routes')
const errorMiddleHandle = require('./src/middlewares/errorMiddlewares')
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
require('dotenv').config()
app.use(cors())
app.use(express.json())
routes(app)

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Thông tin API Manga',
            // version: '0.1',
            // description:
            //     "This is a simple Book API application made with Express and documented with Swagger",
            // license: {
            //     name: "MIT",
            //     url: "https://spdx.org/licenses/MIT.html",
            // },
            // contact: {
            //     name: "skills with arif",
            //     url: "arif.com",
            //     email: "info@email.com",
            // },
        },
        servers: [
            {
                url: "http://localhost:3001/",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",//tên miền website hiện thị api
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use(errorMiddleHandle)

const http = require("http").Server(app);

connectDb.connectDb()

http.listen(port,()=>{
    console.log("Sever is running in port: " + port )
})