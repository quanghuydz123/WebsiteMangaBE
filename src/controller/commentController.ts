import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import CommentModel, { Comment, TOEXICWORDS } from '../models/CommentModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';

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
        const totalComment = await CommentModel.countDocuments(); // Get the total number of comments
        const commentList = await CommentModel.find()
            .skip(skip)
            .limit(limit); // Get the paginated results

        // Use GenericResponse for success
        const response: GenericResponse<{
            page: number;
            totalComment: number;
            totalPages: number;
            comments: typeof commentList; // Adjusting to the actual type of commentList
        }> = {
            message: 'Comments retrieved successfully.',
            data: {
                page,
                totalComment,
                totalPages: Math.ceil(totalComment / limit),
                comments: commentList,
            },
        };

        res.status(200).json(response);
    } catch (error: any) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving comments: ' + error.message,
            data: null,
        };
        res.status(500).json(errorResponse);
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

        // Use GenericResponse for success
        const response: GenericResponse<{
            page: number;
            totalComments: number;
            totalPages: number;
            comments: typeof commentList; // Adjusting to the actual type of commentList
        }> = {
            message: 'Comments retrieved successfully.',
            data: {
                page: pageNumber,
                totalComments,
                totalPages: Math.ceil(totalComments / limitNumber),
                comments: commentList,
            },
        };

        res.status(200).json(response);
    } catch (error: any) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving comments: ' + error.message,
            data: null,
        };
        res.status(500).json(errorResponse);
    }
};

const createComment = async (req: Request, res: Response) => {
    let { user, text = "", manga, isReturnNewData } = req.body;

    // Check for required fields
    if (!user || !text || !manga) {
        const errorResponse: GenericResponse<null> = {
            message: "User, text, and manga are required.",
            data: null
        };
        return res.status(400).json(errorResponse);
    }
    if (containsToxicWords(text as string)) {
        const errorResponse: GenericResponse<null> = {
            message: "vi phạm tiêu chuẩn cộng đồng",
            data: null
        };
        return res.status(403).json(errorResponse);
    }
    const comment = new CommentModel({ user, text, manga });

    try {
        const newComment: Comment = await comment.save();

        // Set responseData based on isReturnNewData
        const responseData = isReturnNewData ? newComment : null; // Return comment if requested, otherwise null

        // Use GenericResponse for success
        const response: GenericResponse<typeof responseData> = {
            message: "Comment created successfully.",
            data: responseData // data will be null if isReturnNewData is false
        };

        res.status(201).json(response);
    } catch (error: any) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: "Server error: " + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

const updateComment = async (req: Request, res: Response) => {
    const { id, text = "", isDeleted, isReturnNewData } = req.body;
    if (text && containsToxicWords(text as string)) {
        const errorResponse: GenericResponse<null> = {
            message: "vi phạm tiêu chuẩn cộng đồng",
            data: null
        };
        return res.status(403).json(errorResponse);
    }
    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            id,
            { text, isDeleted },
            { new: true } // Ensure the updated document is returned
        );

        if (!updatedComment) {
            const notFoundResponse: GenericResponse<null> = {
                message: 'Comment not found.',
                data: null
            };
            return res.status(404).json(notFoundResponse);
        }

        // Use GenericResponse for success
        const response: GenericResponse<typeof updatedComment | null> = {
            message: 'Comment updated successfully.',
            data: isReturnNewData ? updatedComment : null,
        };

        res.status(200).json(response);
    } catch (error: any) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Server error: ' + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
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

        // Create a response object using GenericResponse
        const response: GenericResponse<{
            page: number;
            totalComment: number;
            totalPages: number;
            comments: typeof commentList
        }> = {
            message: 'Comments retrieved successfully.',
            data: {
                page,
                totalComment,
                totalPages: Math.ceil(totalComment / limit),
                comments: commentList,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving comments',
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

function containsToxicWords(comment: string): boolean {
    const normalizedComment = comment.toLowerCase();
    return Array.from(TOEXICWORDS).some(toxicWord => normalizedComment.includes(toxicWord));
}



export default {
    createManyComment,
    getPaginatedComment,
    getAdvancedPaginatedComment,
    createComment,
    updateComment,
    getPaginatedCommentForManga
};
