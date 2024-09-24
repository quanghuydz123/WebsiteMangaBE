import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@manga.mglez.mongodb.net/?retryWrites=true&w=majority&appName=manga`;
const localurl = 'mongodb://localhost:27017/CNPMM';

const connectDb = async (app: Express.Application) => {
    try {
        await mongoose.connect(localurl);
        console.log("Connect success");
    } catch (err) {
        console.error(err);
    }
};

// Directly export the function
export default connectDb;
