import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import ChapterModel from '../models/ChapterModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyChapter = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Chapter } = req.body;

    await Promise.all(tb_Chapter.map(async (chapter: { _id: string }) => {
        await ChapterModel.create({
            ...chapter,
            _id: new mongoose.Types.ObjectId(chapter._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
    const chapters = await ChapterModel.find();
    res.status(200).json({
        status: 200,
        message: "Thành công",
        chapters,
    });
});

export default {
    createManyChapter,
    getAll
};
