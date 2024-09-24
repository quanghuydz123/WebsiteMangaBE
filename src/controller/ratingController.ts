import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import RatingModel from '../models/RatingModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyRating = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Rating } = req.body;

    await Promise.all(tb_Rating.map(async (rating: { _id: string }) => {
        await RatingModel.create({
            ...rating,
            _id: new mongoose.Types.ObjectId(rating._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

export default {
    createManyRating,
};
