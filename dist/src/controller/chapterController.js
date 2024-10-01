"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const ChapterModel_1 = __importDefault(require("../models/ChapterModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyChapter = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Chapter } = req.body;
    await Promise.all(tb_Chapter.map(async (chapter) => {
        await ChapterModel_1.default.create({
            ...chapter,
            _id: new mongoose_1.default.Types.ObjectId(chapter._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getPaginatedChapters = async (req, res) => {
    const mangaId = new mongoose_1.default.Types.ObjectId(req.query.mangaId); // Get mangaId from query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10
    const skip = (page - 1) * limit; // Calculate how many items to skip
    const orderType = req.query.page;
    let manga = {};
    if (mangaId) {
        manga = { manga: mangaId };
    }
    try {
        const totalChapters = await ChapterModel_1.default.countDocuments(manga); // Get the total number of chapters
        const chapterList = await ChapterModel_1.default.find(manga)
            .sort({ updatedAt: (orderType === 'ASC') ? 1 : -1 })
            .skip(skip)
            .limit(limit); // Get the paginated results
        res.status(200).json({
            page,
            totalChapters,
            totalPages: Math.ceil(totalChapters / limit),
            chapters: chapterList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving chapters', error });
    }
};
const getAdvancedPaginatedChapter = async (req, res) => {
    const mangaId = new mongoose_1.default.Types.ObjectId(req.query.mangaId); // Get mangaId from query
    const filter = req.query.filter ?? "";
    const pageNumber = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limitNumber = parseInt(req.query.limit, 10) || 10; // Default to limit 10
    const skip = (pageNumber - 1) * limitNumber; // Calculate how many items to skip
    let manga = {};
    if (mangaId) {
        manga = { manga: mangaId };
    }
    try {
        const totalChapters = await ChapterModel_1.default.countDocuments(manga); // Get the total number of chapters
        // Build the projection object
        const projection = {};
        if (filter) {
            // Split the filter string and include only those fields
            const filterArray = filter.split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1; // Include the field in the response
            });
        }
        // Get the paginated results
        const chapterList = await ChapterModel_1.default.find({ manga: mangaId })
            .select(projection)
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            page: pageNumber,
            totalChapters,
            totalPages: Math.ceil(totalChapters / limitNumber),
            chapters: chapterList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving chapters', error });
    }
};
const appendChapter = async (req, res) => {
    const { manga, title, imageLink, isReturnNewData } = req.body;
    if (!manga || !title) {
        return res.status(400).json({ success: false, message: "Manga and title are required." });
    }
    const lastTitle = await getLastTitle(manga);
    const match = lastTitle.match(/chapter\s-\s([\d.]+)/i) ?? "0";
    const number = Math.floor(Number(match[1])) + 1;
    console.log(lastTitle, "-", match[1], "-", number);
    try {
        const chapter = new ChapterModel_1.default({ manga: manga, title: "chapter - " + number + ": " + title, imageLink: imageLink });
        const newChapter = await chapter.save();
        res.status(201).json({
            success: true,
            message: "Chapter created successfully.",
            data: isReturnNewData ? newChapter : null
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error." + error.message });
    }
};
const updateChapter = async (req, res) => {
    const id = new mongoose_1.default.Types.ObjectId(req.query.id);
    const { title, isDeleted, imageLink, isReturnNewData } = req.body;
    try {
        const updatedChapter = await ChapterModel_1.default.findByIdAndUpdate(id, {
            ...(title && { title }),
            ...(isDeleted !== undefined && { isDeleted }),
            ...(imageLink && { imageLink }) // Include imageLink update
        }, { new: true } // Return updated document if requested
        );
        if (!updatedChapter) {
            return res.status(404).json({ success: false, message: "Chapter not found." });
        }
        res.status(200).json({
            success: true,
            message: "Chapter updated successfully.",
            data: isReturnNewData ? updatedChapter : null // Return updated data if requested
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};
async function getLastTitle(manga) {
    const lastChapter = await ChapterModel_1.default.findOne({ manga: manga })
        .sort({ updatedAt: -1 })
        .select('title');
    return lastChapter ? lastChapter.title : Date.now().toString(); // Return epoch time if null
}
const selfQueryChapter = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = {}, options = {} } = req.body;
        // Construct pagination options
        const paginationOptions = {
            page: Number(page),
            limit: Number(limit),
            select: options.select ? options.select.join(' ') : 'title createAt updatedAt', // Join if it's an array
            sort: options.sort || { createAt: -1 }, // Sort by `createAt` descending by default
            lean: options.lean || true, // Whether to return plain JS objects
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
        const result = await ChapterModel_1.default.paginate(queryFilter, paginationOptions);
        // Send the paginated results back to the client
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.default = {
    createManyChapter,
    getPaginatedChapters,
    getAdvancedPaginatedChapter,
    appendChapter,
    updateChapter,
    selfQueryChapter
};
