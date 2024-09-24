import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';
import connectDb from './src/configs/connectDb';
import errorMiddleHandle from './src/middlewares/errorMiddlewares';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
routes(app);

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
// const specs = swaggerJsdoc(options);
// app.use(
//     "/api-docs",//tên miền website hiện thị api
//     swaggerUi.serve,
//     swaggerUi.setup(specs)
// );

app.use(errorMiddleHandle);

const http = require('http').Server(app);

// Directly call the function
connectDb(app);

http.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
