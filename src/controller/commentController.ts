import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import CommentModel from '../models/CommentModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyComment = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Comment } = req.body;

    await Promise.all(tb_Comment.map(async (comment: { _id: string }) => {
        await CommentModel.create({
            ...comment,
            _id: new mongoose.Types.ObjectId(comment._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

export default {
    createManyComment,
};
