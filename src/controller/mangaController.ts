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

const getPaginatedManga = async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit: number = 10; // Items per page
    const skip: number = (page - 1) * limit; // Calculate how many items to skip

    try {
        const totalManga = await MangaModel.countDocuments(); // Get the total number of manga
        const mangaList = await MangaModel.find()
            .skip(skip)
            .limit(limit); // Get the paginated results

        res.status(200).json({
            page,
            totalManga,
            totalPages: Math.ceil(totalManga / limit),
            manga: mangaList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving manga', error });
    }
};

export default {
    createManyManga,
    getAll,
    getPaginatedManga
};
