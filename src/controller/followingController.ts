import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import FollowingModel from '../models/FollowingModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { title } from 'process';

dotenv.config();

interface MangaFollowed {
    _id: mongoose.Types.ObjectId,
    idManga: mongoose.Types.ObjectId,
    mangaName: string, // The name from Manga
    mangaImageUrl: string, // The url from Manga,
    idLastestChapter: mongoose.Types.ObjectId,
    latestChapterId: mongoose.Types.ObjectId, // Latest chapter ID
    latestChapterTitle: string, // Latest chapter title
    latestChapterCreatedAt: Date // Latest chapter created date
}


const createManyFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Following } = req.body;

    await Promise.all(tb_Following.map(async (following: { _id: string }) => {
        await FollowingModel.create({
            ...following,
            _id: new mongoose.Types.ObjectId(following._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

// Get paginated followings
const getPaginatedFollowing = async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const skip: number = (page - 1) * limit;

    try {
        const totalFollowings = await FollowingModel.countDocuments(); // Total followings
        const followingList = await FollowingModel.find().skip(skip).limit(limit); // Paginated results

        res.status(200).json({
            page,
            totalFollowings,
            totalPages: Math.ceil(totalFollowings / limit),
            followings: followingList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving followings', error: error });
    }
};

// Get advanced paginated followings with filtering
const getAdvancedPaginatedFollowing = async (req: Request, res: Response) => {
    const { page, limit, filter } = req.query;
    const pageNumber: number = parseInt(page as string, 10) || 1;
    const limitNumber: number = parseInt(limit as string, 10) || 10;
    const skip: number = (pageNumber - 1) * limitNumber;

    try {
        const totalFollowings = await FollowingModel.countDocuments();

        const projection: any = {};
        if (filter) {
            const filterArray = (filter as string).split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1;
            });
        }

        const followingList = await FollowingModel.find().select(projection).skip(skip).limit(limitNumber);

        res.status(200).json({
            page: pageNumber,
            totalFollowings,
            totalPages: Math.ceil(totalFollowings / limitNumber),
            followings: followingList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving followings', error: error });
    }
};

// Create a following
const createFollowing = async (req: Request, res: Response) => {
    const { user, manga, isReturnNewData } = req.body;

    if (!user || !manga) {
        return res.status(400).json({ success: false, message: "User and manga are required." });
    }

    const following = new FollowingModel({ user, manga });

    try {
        const newFollowing = await following.save();

        const responseData = isReturnNewData ? newFollowing : null;

        res.status(201).json({
            success: true,
            message: "Following created successfully.",
            data: responseData
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// Update a following
const updateFollowing = async (req: Request, res: Response) => {
    
    const { id, user, manga, isReturnNewData } = req.body;

    try {
        const updatedFollowing = await FollowingModel.findByIdAndUpdate(id, { user, manga }, { new: true });

        if (!updatedFollowing) {
            return res.status(404).json({ success: false, message: 'Following not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Following updated successfully.',
            data: isReturnNewData ? updatedFollowing : null,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};

const deleteFollowing = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedFollowing = await FollowingModel.findByIdAndDelete(id);

        if (!deletedFollowing) {
            return res.status(404).json({
                success: false,
                message: 'Following not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Following deleted successfully.',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
};

const getUserLibrary = async (req: Request, res: Response) => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.query.id as string);
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const skip: number = (page - 1) * limit;

    try {
        const totalFollowings = await FollowingModel.countDocuments({ user: userId });
        const followingList: MangaFollowed[] = await FollowingModel.aggregate([
            { $match: { user: userId } }, // Filter for the user
            { $skip: skip }, // Skip for pagination
            { $limit: limit }, // Limit for pagination
            {
                $lookup: {
                    from: 'mangas', // The collection to join
                    localField: 'manga', // Field from the Following collection
                    foreignField: '_id', // Field from the Mangas collection
                    as: 'mangaDetails' // Output array field
                }
            },
            {
                $unwind: '$mangaDetails' // Unwind the mangaDetails array
            },
            {
                $lookup: {
                    from: 'chapters', // The collection to join for chapters
                    localField: 'mangaDetails._id', // Field from the mangaDetails
                    foreignField: 'manga', // Field in the Chapter collection that references Manga
                    as: 'latestChapter', // Output array field
                    pipeline: [
                        { $sort: { title: -1 } }, // Sort by title in descending order
                        { $limit: 1 } // Limit to the latest chapter
                    ]
                }
            },
            {
                $unwind: {
                    path: '$latestChapter', // Unwind the latestChapter array
                    preserveNullAndEmptyArrays: true // Keep if no chapters exist
                }
            },
            {
                $project: { // Specify the fields to return
                    idManga: '$mangaDetails._id',
                    mangaName: '$mangaDetails.name', // The name from Manga
                    mangaImageUrl: '$mangaDetails.imageUrl', // The url from Manga
                    latestChapterId: '$latestChapter._id', // Latest chapter ID
                    latestChapterTitle: '$latestChapter.title', // Latest chapter title
                    latestChapterCreatedAt: '$latestChapter.createdAt' // Latest chapter created date
                }
            }
        ]);

        res.status(200).json({
            page,
            totalFollowings,
            totalPages: Math.ceil(totalFollowings / limit),
            followings: followingList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving followings', error: error });
    }
};

const deleteFollowingsByMangaId = async (req: Request, res: Response) => {
    const { idManga } = req.params; // Assuming idManga is passed as a route parameter

    if (!idManga) {
        return res.status(400).json({ success: false, message: "Manga ID is required." });
    }

    try {
        const result = await FollowingModel.deleteMany({ manga: idManga });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} followings deleted successfully.`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: ", error: error });
    }
};

export default {
    createManyFollowing,
    getPaginatedFollowing,
    getAdvancedPaginatedFollowing,
    createFollowing,
    updateFollowing,
    deleteFollowing,
    getUserLibrary,
    deleteFollowingsByMangaId
};
