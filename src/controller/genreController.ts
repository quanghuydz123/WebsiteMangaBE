import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import GenreModel from '../models/GenreModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyGenre = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Genre } = req.body;

    await Promise.all(tb_Genre.map(async (genre: { _id: string }) => {
        await GenreModel.create({
            ...genre,
            _id: new mongoose.Types.ObjectId(genre._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

export default {
    createManyGenre,
};
