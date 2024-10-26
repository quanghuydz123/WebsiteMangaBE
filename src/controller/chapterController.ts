import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import ChapterModel, { Chapter } from '../models/ChapterModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';
import fileController from './fileController';
import notificationController from './notificationController';
import MangaModel, { Manga } from '../models/MangaModel';

dotenv.config();

const createManyChapter = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Chapter } = req.body;

    // Delete all existing chapters
    await ChapterModel.deleteMany({});
    // Insert the new chapters
    await ChapterModel.insertMany(tb_Chapter);

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

const getChapterListByMangaId = async (req: Request, res: Response) => {
    try {
        const { mangaId, orderType = 'DESC', page = 1, limit = 10 } = req.query;

        if (!mangaId) {
            const errorResponse: GenericResponse<null> = {
                message: 'mangaId is required',
                data: null
            };
            return res.status(400).json(errorResponse);
        }

        // Determine sort order based on orderType
        const sortOrder = orderType === 'ASC' ? 1 : -1;

        // Paginate options with sort and field selection
        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: { chapterNum: sortOrder }, // Sort by chapterNum based on orderType
            select: 'chapterNum title updatedAt _id' // Only select necessary fields
        };

        // Fetching chapters with pagination
        const chapters = await ChapterModel.paginate(
            { manga: mangaId, isDeleted: false },
            options
        );

        const response: GenericResponse<typeof chapters> = {
            message: 'Chapters retrieved successfully',
            data: chapters
        };

        return res.status(200).json(response);
    } catch (error) {
        const errorResponse: GenericResponse<null> = {
            message: 'Error fetching chapters:' + error,
            data: null,
        };
        return res.status(500).json(errorResponse);
    }
};



const appendChapter = async (req: Request, res: Response) => {
    const { manga = "", title = "", imageLinks = [], isReturnNewData = false } = req.body;

    if (!manga || !title) {
        const errorResponse: GenericResponse<null> = {
            message: "Manga and title are required.",
            data: null
        };
        return res.status(400).json(errorResponse);
    }
    try {
        // Find the last chapter of the manga based on chapterNum
        const lastChapter = await ChapterModel
            .findOne({ manga: manga })
            .sort({ chapterNum: -1 })
            .select('chapterNum')
            .exec();

        // Ensure chapterNum is cast to an integer, then increment
        const lastChapterNum = lastChapter ? Math.floor(lastChapter.chapterNum) : 0;
        const newChapterNum = lastChapterNum + 1;

        const chapter = new ChapterModel({
            manga: manga,
            title: `Chapter - ${newChapterNum}: ${title}`,
            imageLinks: imageLinks,
            chapterNum: newChapterNum
        });

        const newChapter: Chapter = await chapter.save();

        const response: GenericResponse<typeof newChapter | null> = {
            message: "Chapter created successfully.",
            data: isReturnNewData ? newChapter : null
        };
        broadcastToUser(newChapter.manga, newChapter.title);
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
    const { title, isDeleted, imageLinks, chapterNum, isReturnNewData } = req.body;

    try {
        // Check if a chapter with the same chapterNum already exists (excluding the current chapter)
        if (chapterNum) {
            const existingChapter = await ChapterModel.findOne({
                _id: { $ne: id },
                manga: req.body.manga, // Ensure we check within the same manga
                chapterNum: chapterNum,
                isDeleted: false
            });

            if (existingChapter) {
                const errorResponse: GenericResponse<null> = {
                    message: `Chapter number ${chapterNum} already exists.`,
                    data: null
                };
                return res.status(400).json(errorResponse);
            }
        }

        // Proceed with the update if chapterNum is unique or not provided
        const updatedChapter = await ChapterModel.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(isDeleted !== undefined && { isDeleted }),
                ...(imageLinks && { imageLinks }), // Include imageLinks update
                ...(chapterNum && { chapterNum }) // Include chapterNum update
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
        if (title && title !== updatedChapter.title) {
            fileController.changeFolderName(title, updatedChapter.title);
        }
        res.status(200).json(response);
    } catch (error: any) {
        const errorResponse: GenericResponse<null> = {
            message: "Server error: " + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
    }
};


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

const getNextChapter = async (req: Request, res: Response) => {
    const { mangaId, chapterNum } = req.query;

    if (!mangaId || !chapterNum) {
        const response: GenericResponse<null> = {
            message: "mangaId and chapterNum are required.",
            data: null
        }
        return res.status(400).json(response);
    }

    try {
        // Find the next chapter with a higher chapterNum in the same manga
        const nextChapter = await ChapterModel.findOne({
            manga: mangaId,
            chapterNum: { $gt: Number(chapterNum) },
            isDeleted: false
        })
            .sort({ chapterNum: 1 }) // Sort to get the immediate next chapter
            .select('chapterNum title _id imageLinks'); // Include imageLinks

        if (!nextChapter) {
            const response: GenericResponse<null> = {
                message: "Next chapter not found.",
                data: null
            }
            return res.status(404).json(response);
        }

        const response: GenericResponse<typeof nextChapter> = {
            message: "Next chapter retrieved successfully.",
            data: nextChapter
        };
        res.status(200).json(response);
    } catch (error) {
        const response: GenericResponse<null> = {
            message: "Error fetching next chapter:" + error,
            data: null
        };
        return res.status(500).json(response);
    }
};

const getPreviousChapter = async (req: Request, res: Response) => {
    const { mangaId, chapterNum } = req.query;

    if (!mangaId || !chapterNum) {
        const response: GenericResponse<null> = {
            message: "mangaId and chapterNum are required.",
            data: null
        }
        return res.status(400).json(response);
    }

    try {
        // Find the previous chapter with a lower chapterNum in the same manga
        const previousChapter = await ChapterModel.findOne({
            manga: mangaId,
            chapterNum: { $lt: Number(chapterNum) },
            isDeleted: false
        })
            .sort({ chapterNum: -1 }) // Sort to get the immediate previous chapter
            .select('chapterNum title _id imageLinks'); // Include imageLinks

        if (!previousChapter) {
            const response: GenericResponse<null> = {
                message: "Previous chapter not found.",
                data: null
            }
            return res.status(404).json(response);
        }

        const response: GenericResponse<typeof previousChapter> = {
            message: "Previous chapter retrieved successfully.",
            data: previousChapter
        };
        res.status(200).json(response);
    } catch (error) {
        const response: GenericResponse<null> = {
            message: "Error fetching previous chapter:" + error,
            data: null
        };
        return res.status(500).json(response);
    }
};


const insertImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, imageLinks, pos } = req.body;
        const result = await ChapterModel.updateOne(
            { _id: chapterId },
            { $splice: { imageLinks: { $position: pos, $each: [imageLinks] } } } // Insert at position
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

        if (!chapter || chapter.imageLinks.length === 0) {
            res.status(404).json({ message: 'Chapter not found or no image link at this position' });
            return;
        }

        res.status(200).json({ message: 'Image link retrieved successfully', data: chapter.imageLinks[0] });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null });
    }
};

const appendImageLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, imageLinks } = req.body;

        const result = await ChapterModel.updateOne(
            { _id: chapterId },
            { $push: { imageLinks: imageLinks } } // Append image link
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({ message: 'Chapter not found or no changes made', data: null } as GenericResponse<null>);
            return;
        }

        const updatedChapter = await ChapterModel.findById(chapterId);
        res.status(200).json({ message: 'Image link appended successfully', data: updatedChapter } as GenericResponse<Chapter>);
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null } as GenericResponse<null>);
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
            res.status(404).json({ message: 'Chapter not found or no changes made', data: null } as GenericResponse<null>);
            return;
        }

        const updatedChapter = await ChapterModel.findById(chapterId);
        res.status(200).json({ message: 'Image link updated successfully', data: updatedChapter } as GenericResponse<Chapter>);
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error), data: null } as GenericResponse<null>);
    }
};

async function broadcastToUser(mangaId: mongoose.Types.ObjectId, newChapterTitle: string) {
    const manga: Manga | null = await MangaModel.findById(mangaId, { _id: 0, name: 1, imageUrl: 1 });
    if (!manga) {
        return;
    }
    notificationController.broadcastNewChapter(`${manga.imageUrl}||Truyện bạn theo dõi ${manga.name} đã có chapter mới: ${newChapterTitle}`, mangaId)
}

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
    insertImageLink,
    getChapterListByMangaId,
    getNextChapter,
    getPreviousChapter
};