import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';
import connectDb from './src/configs/connectDb';
import errorMiddleHandle from './src/middlewares/errorMiddlewares';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
routes(app);
app.use(errorMiddleHandle);

const http = require('http').Server(app);

// Directly call the function
connectDb(app);

http.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
