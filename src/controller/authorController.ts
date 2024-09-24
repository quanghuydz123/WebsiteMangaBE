import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import AuthorModel from '../models/AuthorModel';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

const createManyAuthor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { tb_Author } = req.body;

    await Promise.all(tb_Author.map(async (author: { _id: string }) => {
        await AuthorModel.create({
            ...author,
            _id: new mongoose.Types.ObjectId(author._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

export default {
    createManyAuthor,
};
