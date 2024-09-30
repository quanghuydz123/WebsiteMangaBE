import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import ChapterModel, { Chapter } from '../models/ChapterModel';
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

const getPaginatedChapters = async (req: Request, res: Response) => {
    const mangaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.query.mangaId as string); // Get mangaId from query
    const page: number = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit: number = parseInt(req.query.limit as string) || 10; // Default to limit 10
    const skip: number = (page - 1) * limit; // Calculate how many items to skip
    const orderType = (req.query.page as string);
    let manga = {};
    if (mangaId) {
        manga = { manga: mangaId }
    }
    try {
        const totalChapters = await ChapterModel.countDocuments(manga); // Get the total number of chapters
        const chapterList = await ChapterModel.find(manga)
            .sort({ updatedAt: (orderType === 'ASC') ? 1 : -1 })
            .skip(skip)
            .limit(limit); // Get the paginated results

        res.status(200).json({
            page,
            totalChapters,
            totalPages: Math.ceil(totalChapters / limit),
            chapters: chapterList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving chapters', error });
    }
};

const getAdvancedPaginatedChapter = async (req: Request, res: Response) => {
    const mangaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.query.mangaId as string); // Get mangaId from query
    const filter: string = (req.query.filter as string) ?? "";
    const pageNumber: number = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limitNumber: number = parseInt(req.query.limit as string, 10) || 10; // Default to limit 10
    const skip: number = (pageNumber - 1) * limitNumber; // Calculate how many items to skip
    let manga = {};
    if (mangaId) {
        manga = { manga: mangaId }
    }
    try {
        const totalChapters = await ChapterModel.countDocuments(manga); // Get the total number of chapters

        // Build the projection object
        const projection: any = {};
        if (filter) {
            // Split the filter string and include only those fields
            const filterArray = (filter as string).split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1; // Include the field in the response
            });
        }

        // Get the paginated results
        const chapterList = await ChapterModel.find({ manga: mangaId })
            .select(projection)
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            page: pageNumber,
            totalChapters,
            totalPages: Math.ceil(totalChapters / limitNumber),
            chapters: chapterList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving chapters', error });
    }
};


const appendChapter = async (req: Request, res: Response) => {
    const { manga, title, imageLink, isReturnNewData } = req.body;

    if (!manga || !title) {
        return res.status(400).json({ success: false, message: "Manga and title are required." });
    }


    const lastTitle = await getLastTitle(manga);

    const match = lastTitle.match(/chapter\s-\s([\d.]+)/i) ?? "0";
    const number = Math.floor(Number(match[1]) )+ 1;
    console.log(lastTitle, "-",match[1],"-",number);
    try {
        const chapter = new ChapterModel({ manga: manga, title: "chapter - " + number + ": " + title, imageLink: imageLink });
        const newChapter: Chapter = await chapter.save();

        res.status(201).json({
            success: true,
            message: "Chapter created successfully.",
            data: isReturnNewData ? newChapter : null
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error." + error.message });
    }
};

const updateChapter = async (req: Request, res: Response) => {
    const id = new mongoose.Types.ObjectId ( req.query.id as string);
    const { title, isDeleted, imageLink, isReturnNewData } = req.body;

    try {
        const updatedChapter = await ChapterModel.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(isDeleted !== undefined && { isDeleted }),
                ...(imageLink && { imageLink }) // Include imageLink update
            },
            { new: true } // Return updated document if requested
        );

        if (!updatedChapter) {
            return res.status(404).json({ success: false, message: "Chapter not found." });
        }

        res.status(200).json({
            success: true,
            message: "Chapter updated successfully.",
            data: isReturnNewData ? updatedChapter : null // Return updated data if requested
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};


async function getLastTitle(manga: unknown): Promise<string> {
    const lastChapter = await ChapterModel.findOne({ manga: manga })
        .sort({ updatedAt: -1 })
        .select('title');

    return lastChapter ? lastChapter.title : Date.now().toString(); // Return epoch time if null
}

export default {
    createManyChapter,
    getPaginatedChapters,
    getAdvancedPaginatedChapter,
    appendChapter,
    updateChapter,

};
