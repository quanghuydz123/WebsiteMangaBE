import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';
import connectDb from './src/configs/connectDb';
import errorMiddleHandle from './src/middlewares/errorMiddlewares';
import { setupSwagger } from './src/middlewares/swagger';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './src/configs/passport-setup'; // Import passport configuration

dotenv.config(); // Load environment variables at the start

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = ['http://localhost:3000']; // Specify allowed origins

// Middleware Setup
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // This allows the server to accept credentials (cookies)
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // Place cookieParser before session
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure: true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
connectDb(app);

// Set view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes and Middleware Setup
app.get('/', (req, res) => {
    res.render('index');
});

routes(app); // Setup routes after session and passport middlewares
setupSwagger(app); // Setup Swagger documentation

// Error handling middleware
app.use(errorMiddleHandle);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
