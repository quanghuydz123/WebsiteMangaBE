import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import MangaModel from '../models/MangaModel';
import FollowingModel, { Following } from '../models/FollowingModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { title } from 'process';
import { GenericResponse } from '../models/GenericResponse';

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
            message: 'Successfully retrieved followings',
            data: {
                page,
                totalFollowings,
                totalPages: Math.ceil(totalFollowings / limit),
                followings: followingList,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving followings',
            data: null // You can modify this according to your error handling preference
        });
    }
};

// Get advanced paginated followings with filtering
const getAdvancedPaginatedFollowing = async (req: Request, res: Response<GenericResponse<{
    page: number;
    totalFollowings: number;
    totalPages: number;
    followings: any[]; // Adjust 'any' to the actual type if you have a defined model
} | null>>) => {
    const { page, limit, filter } = req.query;
    const pageNumber: number = parseInt(page as string, 10) || 1;
    const limitNumber: number = parseInt(limit as string, 10) || 10;
    const skip: number = (pageNumber - 1) * limitNumber;

    try {
        const totalFollowings = await FollowingModel.countDocuments();

        const projection: Record<string, number> = {};
        if (filter) {
            const filterArray = (filter as string).split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1; // Include the attribute in the projection
            });
        }

        const followingList = await FollowingModel.find().select(projection).skip(skip).limit(limitNumber);

        res.status(200).json({
            message: 'Successfully retrieved followings',
            data: {
                page: pageNumber,
                totalFollowings,
                totalPages: Math.ceil(totalFollowings / limitNumber),
                followings: followingList,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving followings',
            data: null, // You can modify this according to your error handling preference
        });
    }
};

// Create a following
const createFollowing = async (req: Request, res: Response<GenericResponse<Following | null>>) => {
    const { user, manga, isReturnNewData } = req.body;

    if (!user || !manga) {
        return res.status(400).json({
            message: "User and manga are required.",
            data: null
        });
    }

    const existFollow = await FollowingModel.findOne({ user: user, manga: manga });
    if (existFollow) {
        return res.status(400).json({
            message: "User and manga already exist.",
            data: null
        });
    }

    const following = new FollowingModel({ user, manga });

    try {
        const newFollowing = await following.save();

        if (newFollowing) {
            await MangaModel.findByIdAndUpdate(newFollowing.manga, { $inc: { followersCount: 1 } }, { new: true });
        } else {
            return res.status(404).json({
                message: 'Manga not found.',
                data: null
            });
        }

        const responseData = isReturnNewData ? newFollowing : null;

        res.status(201).json({
            message: "Following created successfully.",
            data: responseData
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Server error: " + error.message,
            data: null // Set data to null on error
        });
    }
};

// Update a following
const updateFollowing = async (req: Request, res: Response<GenericResponse<Following | null>>) => {
    const { id, user, manga, isReturnNewData } = req.body;

    try {
        const updatedFollowing = await FollowingModel.findByIdAndUpdate(id, { user, manga }, { new: true });

        if (!updatedFollowing) {
            return res.status(404).json({
                message: 'Following not found.',
                data: null // Set data to null if not found
            });
        }

        res.status(200).json({
            message: 'Following updated successfully.',
            data: isReturnNewData ? updatedFollowing : null, // Return updated following or null based on flag
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Server error.',
            data: null,

        });
    }
};

const deleteFollowing = async (req: Request, res: Response<GenericResponse<null>>) => {
    const { id } = req.query;

    try {
        const deletedFollowing = await FollowingModel.findByIdAndDelete(id);

        if (!deletedFollowing) {
            return res.status(404).json({
                message: 'Following not found.',
                data: null, // Set data to null if not found
            });
        }

        // Update the followers count in the associated manga
        await MangaModel.findByIdAndUpdate(deletedFollowing.manga, { $inc: { followersCount: -1 } }, { new: true });

        res.status(200).json({
            message: 'Following deleted successfully.',
            data: null, // No specific data to return on delete
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Server error: ' + error.message,
            data: null, // Set data to null on error
        });
    }
};

const getUserLibrary = async (req: Request, res: Response<GenericResponse<MangaFollowed[] | null>>) => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.query.id as string);
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const skip: number = (page - 1) * limit;

    try {
        

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
                        { $match: { isDeleted: false } }, // Filter chapters where isDeleted is false
                        { $sort: { chapterNum: -1 } }, // Sort by chapNum in descending order
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
                    _id: '$mangaDetails._id',
                    idManga: '$mangaDetails._id',
                    mangaName: '$mangaDetails.name', // The name from Manga
                    mangaImageUrl: '$mangaDetails.imageUrl', // The URL from Manga
                    latestChapterId: '$latestChapter._id', // Latest chapter ID
                    latestChapterTitle: '$latestChapter.title', // Latest chapter title
                    latestChapterCreatedAt: '$latestChapter.createdAt' // Latest chapter created date
                }
            }
        ]);

        // Prepare response data
        const responseData: MangaFollowed[] = followingList;
        console.log(followingList[0].latestChapterTitle)
        res.status(200).json({
            message: 'User library retrieved successfully.',
            data: responseData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving followings: ' + JSON.stringify(error),
            data: null, // Return null on error
        });
    }
};

const unFollowing = async (req: Request, res: Response<GenericResponse<Following | null>>) => {
    const { user, manga, isReturnDeletedData } = req.body;

    if (!user || !manga) {
        return res.status(400).json({
            message: "User and manga are required.",
            data: null,
        });
    }

    const existFollow = await FollowingModel.findOne({ user, manga });
    if (!existFollow) {
        return res.status(404).json({
            message: "Following does not exist.",
            data: null,
        });
    }

    try {
        const deletedFollowing = await FollowingModel.findByIdAndDelete(existFollow._id);
        if (deletedFollowing) {
            await MangaModel.findByIdAndUpdate(deletedFollowing.manga, { $inc: { followersCount: -1 } }, { new: true });
        } else {
            return res.status(404).json({
                message: 'Following not found.',
                data: null,
            });
        }

        const responseData = isReturnDeletedData ? deletedFollowing : null;
        res.status(200).json({
            message: "Following deleted successfully.",
            data: responseData,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Server error: " + error.message,
            data: null, // Ensure data is null in case of an error
        });
    }
};


const deleteFollowingsByMangaId = async (req: Request, res: Response<GenericResponse<null>>) => {
    const { idManga } = req.params; // Assuming idManga is passed as a route parameter

    if (!idManga) {
        return res.status(400).json({
            message: "Manga ID is required.",
            data: null,
        });
    }

    try {
        const result = await FollowingModel.deleteMany({ manga: idManga });

        res.status(200).json({
            message: `${result.deletedCount} followings deleted successfully.`,
            data: null, // No specific data to return, so it's set to null
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Server error: " + error.message,
            data: null, // Ensure data is null in case of an error
        });
    }
};

const getUserListByMangaId = async (mangaId: mongoose.Types.ObjectId): Promise<string[]> => {
    try {
        const result = await FollowingModel.find({ manga: mangaId }, { _id: 0, user: 1 });
        const userIds = result.map(doc => doc.user.toString());
        return userIds;
    } catch (error: any) {
        return [];
    }
}

const checkIsFollow = async (req: Request, res: Response<GenericResponse<boolean | null>>) => {
    const { idManga, idUser } = req.query; // Assuming idManga is passed as a route parameter

    if (!idManga || !idUser) {
        return res.status(400).json({
            message: "Manga and idUser ID is required.",
            data: null as null,
        });
    }

    try {
        const follow = await FollowingModel.findOne({ manga: idManga, user: idUser })
        if (follow) {
            res.status(200).json({
                message: 'Người dùng có theo dõi truyện này',
                data: true as boolean
            });
        } else {
            res.status(200).json({
                message: 'Người dùng không có theo dõi truyện này',
                data: false as boolean
            });
        }

    } catch (error: any) {
        res.status(500).json({
            message: "Server error: " + error.message,
            data: null, // Ensure data is null in case of an error
        });
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
    deleteFollowingsByMangaId,
    unFollowing,
    getUserListByMangaId,
    checkIsFollow
};
