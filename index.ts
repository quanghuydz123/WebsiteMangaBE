import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';
import connectDb from './src/configs/connectDb';
import errorMiddleHandle from './src/middlewares/errorMiddlewares';
import { setupSwagger } from './src/middlewares/swagger';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Use environment port or default to 3001

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to the database
connectDb(app);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});

// Setup routes before file manager middleware
routes(app);

// Setup Swagger documentation
setupSwagger(app);

// Error handling middleware
app.use(errorMiddleHandle);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
