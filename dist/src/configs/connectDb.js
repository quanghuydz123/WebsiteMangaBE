"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSOWRD}@manga.mglez.mongodb.net/?retryWrites=true&w=majority&appName=manga`;
const connectDb = async (app) => {
    try {
        await mongoose_1.default.connect(dbUrl);
        console.log("Connect success");
    }
    catch (err) {
        console.error(err);
    }
};
// Directly export the function
exports.default = connectDb;
