import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import CommentModel, { Comment } from '../models/CommentModel';
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

const getPaginatedComment = async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit: number = parseInt(req.query.limit as string, 10) || 10; // Default to limit 10
    const skip: number = (page - 1) * limit;
    try {
        const totalComment = await CommentModel.countDocuments(); // Get the total number of Comment
        const commentList = await CommentModel.find()
            .skip(skip)
            .limit(limit); // Get the paginated results

        res.status(200).json({
            page,
            totalComment,
            totalPages: Math.ceil(totalComment / limit),
            Comment: commentList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Comment', error: error });
    }
};
const getAdvancedPaginatedComment = async (req: Request, res: Response) => {
    const { page, limit, filter } = req.query;

    const pageNumber: number = parseInt(page as string, 10) || 1; // Default to page 1
    const limitNumber: number = parseInt(limit as string, 10) || 10; // Default to limit 10
    const skip: number = (pageNumber - 1) * limitNumber; // Calculate how many items to skip

    try {
        const totalComments = await CommentModel.countDocuments(); // Get the total number of comments

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
        const commentList = await CommentModel.find()
            .select(projection)
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            page: pageNumber,
            totalComments,
            totalPages: Math.ceil(totalComments / limitNumber),
            comments: commentList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error });
    }
};
const createComment = async (req: Request, res: Response) => {
    const { user, text, manga, isReturnNewData } = req.body;

    if (!user || !text || !manga) {
        return res.status(400).json({ success: false, message: "User, text, and manga are required." });
    }

    const comment = new CommentModel({ user, text, manga });

    try {
        const newComment: Comment = await comment.save();


        // Set responseData based on isReturnNewData
        const responseData = isReturnNewData ? newComment : null; // Return comment if requested, otherwise null

        res.status(201).json({
            success: true,
            message: "Comment created successfully.",
            data: responseData // data will be null if isReturnNewData is false
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

const updateComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text, isDeleted, isReturnNewData } = req.body;

    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            id,
            { text, isDeleted },

        );

        if (!updatedComment) {
            return res.status(404).json({ success: false, message: 'Comment not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully.',
            data: isReturnNewData ? updatedComment : null,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};

const getPaginatedCommentForManga = async (req: Request, res: Response) => {
    const mangaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.query.id as string);
    const page: number = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit: number = parseInt(req.query.limit as string, 10) || 10; // Default to limit 10
    const skip: number = (page - 1) * limit;
    try {
        const totalComment = await CommentModel.countDocuments({ manga: mangaId }); // Get the total number of comments
        const commentList = await CommentModel.aggregate([
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
                    pipeline: [ // Optional: use pipeline if you need specific fields from users
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
                $project: { // Specify the fields to return
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
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error });
    }
};



export default {
    createManyComment,
    getPaginatedComment,
    getAdvancedPaginatedComment,
    createComment,
    updateComment,
    getPaginatedCommentForManga
};
