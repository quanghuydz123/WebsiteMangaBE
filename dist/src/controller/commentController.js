"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const CommentModel_1 = __importDefault(require("../models/CommentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyComment = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Comment } = req.body;
    await Promise.all(tb_Comment.map(async (comment) => {
        await CommentModel_1.default.create({
            ...comment,
            _id: new mongoose_1.default.Types.ObjectId(comment._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getPaginatedComment = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10
    const skip = (page - 1) * limit;
    try {
        const totalComment = await CommentModel_1.default.countDocuments(); // Get the total number of Comment
        const commentList = await CommentModel_1.default.find()
            .skip(skip)
            .limit(limit); // Get the paginated results
        res.status(200).json({
            page,
            totalComment,
            totalPages: Math.ceil(totalComment / limit),
            Comment: commentList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving Comment', error: error });
    }
};
const getAdvancedPaginatedComment = async (req, res) => {
    const { page, limit, filter } = req.query;
    const pageNumber = parseInt(page, 10) || 1; // Default to page 1
    const limitNumber = parseInt(limit, 10) || 10; // Default to limit 10
    const skip = (pageNumber - 1) * limitNumber; // Calculate how many items to skip
    try {
        const totalComments = await CommentModel_1.default.countDocuments(); // Get the total number of comments
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
        const commentList = await CommentModel_1.default.find()
            .select(projection)
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            page: pageNumber,
            totalComments,
            totalPages: Math.ceil(totalComments / limitNumber),
            comments: commentList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error });
    }
};
const createComment = async (req, res) => {
    const { user, text, manga, isReturnNewData } = req.body;
    if (!user || !text || !manga) {
        return res.status(400).json({ success: false, message: "User, text, and manga are required." });
    }
    const comment = new CommentModel_1.default({ user, text, manga });
    try {
        const newComment = await comment.save();
        // Set responseData based on isReturnNewData
        const responseData = isReturnNewData ? newComment : null; // Return comment if requested, otherwise null
        res.status(201).json({
            success: true,
            message: "Comment created successfully.",
            data: responseData // data will be null if isReturnNewData is false
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};
const updateComment = async (req, res) => {
    const { id, text, isDeleted, isReturnNewData } = req.body;
    try {
        const updatedComment = await CommentModel_1.default.findByIdAndUpdate(id, { text, isDeleted });
        if (!updatedComment) {
            return res.status(404).json({ success: false, message: 'Comment not found.' });
        }
        res.status(200).json({
            success: true,
            message: 'Comment updated successfully.',
            data: isReturnNewData ? updatedComment : null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};
const getPaginatedCommentForManga = async (req, res) => {
    const mangaId = new mongoose_1.default.Types.ObjectId(req.query.id);
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10
    const skip = (page - 1) * limit;
    try {
        const totalComment = await CommentModel_1.default.countDocuments({ manga: mangaId }); // Get the total number of comments
        const commentList = await CommentModel_1.default.aggregate([
            { $match: { manga: mangaId } }, // Filter for the manga
            { $sort: { updatedAt: -1 } }, // Sort by updatedAt in descending order
            { $skip: skip }, // Skip for pagination
            { $limit: limit }, // Limit for pagination
            {
                $lookup: {
                    from: 'users', // The collection to join
                    localField: 'user', // Field from the Comment collection
                    foreignField: '_id', // Field from the Users collection
                    as: 'UserDetails', // Output array field
                    pipeline: [
                        {
                            $project: {
                                userName: 1, // Include userName only
                                // Add other fields as necessary
                            }
                        }
                    ],
                }
            },
            {
                $unwind: {
                    path: '$UserDetails', // Unwind the userDetails array
                    preserveNullAndEmptyArrays: true // Keep comments even if there's no matching user
                }
            },
            {
                $project: {
                    _idComment: '$_id', // The _id from Comment
                    userName: '$UserDetails.userName', // The name from User
                    text: '$text', // The content from Comment
                    updatedAt: '$updatedAt'
                }
            }
        ]);
        res.status(200).json({
            page,
            totalComment,
            totalPages: Math.ceil(totalComment / limit),
            comments: commentList, // Ensure consistency with the key
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error });
    }
};
exports.default = {
    createManyComment,
    getPaginatedComment,
    getAdvancedPaginatedComment,
    createComment,
    updateComment,
    getPaginatedCommentForManga
};
