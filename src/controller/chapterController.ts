import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import ChapterModel, { Chapter } from '../models/ChapterModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';

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
    const orderType = (req.query.orderType as string) || 'DESC'; // Set orderType for sorting, default to DESC
    let mangaFilter = {};

    if (mangaId) {
        mangaFilter = { manga: mangaId };
    }

    try {
        const totalChapters = await ChapterModel.countDocuments(mangaFilter); // Get the total number of chapters
        const chapterList = await ChapterModel.find(mangaFilter)
            .sort({ updatedAt: (orderType === 'ASC') ? 1 : -1 }) // Sort by update date based on orderType
            .skip(skip)
            .limit(limit); // Get the paginated results

        const response: GenericResponse<{
            page: number;
            totalChapters: number;
            totalPages: number;
            chapters: typeof chapterList;
        }> = {
            message: 'Chapters retrieved successfully',
            data: {
                page,
                totalChapters,
                totalPages: Math.ceil(totalChapters / limit),
                chapters: chapterList,
            }
        };

        res.status(200).json(response);
    } catch (error) {
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving chapters',
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

const getAdvancedPaginatedChapter = async (req: Request, res: Response) => {
    const mangaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.query.mangaId as string); // Get mangaId from query
    const filter: string = (req.query.filter as string) ?? "";
    const pageNumber: number = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limitNumber: number = parseInt(req.query.limit as string, 10) || 10; // Default to limit 10
    const skip: number = (pageNumber - 1) * limitNumber; // Calculate how many items to skip
    let mangaFilter = {};

    if (mangaId) {
        mangaFilter = { manga: mangaId };
    }

    try {
        const totalChapters = await ChapterModel.countDocuments(mangaFilter); // Get the total number of chapters

        // Build the projection object
        const projection: any = {};
        if (filter) {
            // Split the filter string and include only those fields
            const filterArray = filter.split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1; // Include the field in the response
            });
        }

        // Get the paginated results
        const chapterList = await ChapterModel.find(mangaFilter)
            .select(projection)
            .skip(skip)
            .limit(limitNumber);

        // Use GenericResponse for success
        const response: GenericResponse<{
            page: number;
            totalChapters: number;
            totalPages: number;
            chapters: typeof chapterList;
        }> = {
            message: 'Chapters retrieved successfully',
            data: {
                page: pageNumber,
                totalChapters,
                totalPages: Math.ceil(totalChapters / limitNumber),
                chapters: chapterList,
            }
        };

        res.status(200).json(response);
    } catch (error) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving chapters',
            data: null
        };
        res.status(500).json(errorResponse);
    }
};


const appendChapter = async (req: Request, res: Response) => {
    const { manga, title, imageLink, isReturnNewData } = req.body;

    if (!manga || !title) {
        const errorResponse: GenericResponse<null> = {
            message: "Manga and title are required.",
            data: null
        };
        return res.status(400).json(errorResponse);
    }

    try {
        const lastTitle = await getLastTitle(manga);

        const match = lastTitle.match(/chapter\s-\s([\d.]+)/i) ?? "0";
        const number = Math.floor(Number(match[1])) + 1;
        console.log(lastTitle, "-", match[1], "-", number);

        const chapter = new ChapterModel({ manga: manga, title: "chapter - " + number + ": " + title, imageLink: imageLink });
        const newChapter: Chapter = await chapter.save();

        const response: GenericResponse<typeof newChapter | null> = {
            message: "Chapter created successfully.",
            data: isReturnNewData ? newChapter : null
        };

        res.status(201).json(response);
    } catch (error: any) {
        const errorResponse: GenericResponse<null> = {
            message: "Server error: " + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

const updateChapter = async (req: Request, res: Response) => {
    const id = new mongoose.Types.ObjectId(req.query.id as string);
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
            const errorResponse: GenericResponse<null> = {
                message: "Chapter not found.",
                data: null
            };
            return res.status(404).json(errorResponse);
        }

        const response: GenericResponse<typeof updatedChapter | null> = {
            message: "Chapter updated successfully.",
            data: isReturnNewData ? updatedChapter : null // Return updated data if requested
        };

        res.status(200).json(response);
    } catch (error: any) {
        const errorResponse: GenericResponse<null> = {
            message: "Server error: " + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
    }
};


async function getLastTitle(manga: unknown): Promise<string> {
    const lastChapter = await ChapterModel.findOne({ manga: manga })
        .sort({ updatedAt: -1 })
        .select('title');

    return lastChapter ? lastChapter.title : Date.now().toString(); // Return epoch time if null
}

const selfQueryChapter = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, filter = {}, options = {} } = req.body;

        // Construct pagination options
        const paginationOptions = {
            page: Number(page),
            limit: Number(limit),
            select: options.select ? options.select.join(' ') : 'title createAt updatedAt',  // Join if it's an array
            sort: options.sort || { createAt: -1 },  // Sort by `createAt` descending by default
            lean: options.lean || true,             // Whether to return plain JS objects
            leanWithId: options.leanWithId || false, // Include `_id` as string if lean
            populate: options.populate || [{ path: 'manga', select: 'title' }], // Populate the `manga` field
        };

        // Filter can contain various criteria, e.g., `title` and `isDeleted`
        const queryFilter = {
            ...(filter.title ? { title: { $regex: filter.title, $options: 'i' } } : {}),
            ...(filter.isDeleted !== undefined ? { isDeleted: filter.isDeleted } : {}),
            ...(filter._id ? { _id: filter._id } : {}), // Fixed _id filter
            ...(filter.manga ? { manga: filter.manga } : {}), // Fixed manga filter
        };

        // Paginate the query with filters and options
        const result = await ChapterModel.paginate(queryFilter, paginationOptions);

        // Use GenericResponse for success
        const response: GenericResponse<typeof result> = {
            message: 'Chapters retrieved successfully',
            data: result
        };

        return res.status(200).json(response);
    } catch (error: any) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving chapters: ' + error.message,
            data: null
        };
        return res.status(500).json(errorResponse);
    }
};

const insertImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, imageLink, pos } = req.body;
        const result = await ChapterModel.updateOne(
            { _id: chapterId },
            { $splice: { imageLinks: { $position: pos, $each: [imageLink] } } } // Insert at position
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Chapter not found or no changes made' });
            return;
        }

        const updatedChapter = await ChapterModel.findById(chapterId);
        res.status(200).json({ message: 'Image link inserted successfully', data: updatedChapter });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null });
    }
};

const removeImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, pos } = req.body;

        const result = await ChapterModel.updateOne(
            { _id: chapterId },
            { $pull: { imageLinks: { $slice: [pos, 1] } } } // Remove image link at position
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Chapter not found or no changes made' });
            return;
        }

        const updatedChapter = await ChapterModel.findById(chapterId);
        res.status(200).json({ message: 'Image link removed successfully', data: updatedChapter });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null });
    }
};

const readImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, pos } = req.body;
        const chapter = await ChapterModel.findOne(
            { _id: chapterId },
            { imageLinks: { $slice: [pos, 1] } } // Read image link at position
        );

        if (!chapter || chapter.imageLink.length === 0) {
            res.status(404).json({ message: 'Chapter not found or no image link at this position' });
            return;
        }

        res.status(200).json({ message: 'Image link retrieved successfully', data: chapter.imageLink[0] });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null });
    }
};

const appendImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, imageLink } = req.body;

        const result = await ChapterModel.updateOne(
            { _id: chapterId },
            { $push: { imageLinks: imageLink } } // Append image link
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Chapter not found or no changes made' });
            return;
        }

        const updatedChapter = await ChapterModel.findById(chapterId);
        res.status(200).json({ message: 'Image link appended successfully', data: updatedChapter });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null });
    }
};

const updateImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, pos, newImageLink } = req.body;

        const result = await ChapterModel.updateOne(
            { _id: chapterId },
            { $set: { [`imageLinks.${pos}`]: newImageLink } } // Update image link at position
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Chapter not found or no changes made' });
            return;
        }

        const updatedChapter = await ChapterModel.findById(chapterId);
        res.status(200).json({ message: 'Image link updated successfully', data: updatedChapter });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null });
    }
};

export default {
    createManyChapter,
    getPaginatedChapters,
    getAdvancedPaginatedChapter,
    appendChapter,
    updateChapter,
    selfQueryChapter,
    appendImageLink,
    updateImageLink,
    readImageLink,
    removeImageLink,
    insertImageLink
};