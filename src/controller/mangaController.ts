import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MangaModel from '../models/MangaModel';
import { Request, Response } from 'express';

dotenv.config();

const createManyManga = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Manga } = req.body;

    await Promise.all(tb_Manga.map(async (manga: { _id: string }) => {
        await MangaModel.create({
            ...manga,
            _id: new mongoose.Types.ObjectId(manga._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
    const manga = await MangaModel.find().populate('author');
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga,
    });
});

export default {
    createManyManga,
    getAll,
};
