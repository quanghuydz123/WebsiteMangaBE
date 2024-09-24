import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSOWRD}@manga.mglez.mongodb.net/?retryWrites=true&w=majority&appName=manga`;

const connectDb = async (app: Express.Application) => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connect success");
    } catch (err) {
        console.error(err);
    }
};

// Directly export the function
export default connectDb;
