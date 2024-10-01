"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const FollowingModel_1 = __importDefault(require("../models/FollowingModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyFollowing = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Following } = req.body;
    await Promise.all(tb_Following.map(async (following) => {
        await FollowingModel_1.default.create({
            ...following,
            _id: new mongoose_1.default.Types.ObjectId(following._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
// Get paginated followings
const getPaginatedFollowing = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    try {
        const totalFollowings = await FollowingModel_1.default.countDocuments(); // Total followings
        const followingList = await FollowingModel_1.default.find().skip(skip).limit(limit); // Paginated results
        res.status(200).json({
            page,
            totalFollowings,
            totalPages: Math.ceil(totalFollowings / limit),
            followings: followingList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving followings', error: error });
    }
};
// Get advanced paginated followings with filtering
const getAdvancedPaginatedFollowing = async (req, res) => {
    const { page, limit, filter } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    try {
        const totalFollowings = await FollowingModel_1.default.countDocuments();
        const projection = {};
        if (filter) {
            const filterArray = filter.split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1;
            });
        }
        const followingList = await FollowingModel_1.default.find().select(projection).skip(skip).limit(limitNumber);
        res.status(200).json({
            page: pageNumber,
            totalFollowings,
            totalPages: Math.ceil(totalFollowings / limitNumber),
            followings: followingList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving followings', error: error });
    }
};
// Create a following
const createFollowing = async (req, res) => {
    const { user, manga, isReturnNewData } = req.body;
    if (!user || !manga) {
        return res.status(400).json({ success: false, message: "User and manga are required." });
    }
    const following = new FollowingModel_1.default({ user, manga });
    try {
        const newFollowing = await following.save();
        const responseData = isReturnNewData ? newFollowing : null;
        res.status(201).json({
            success: true,
            message: "Following created successfully.",
            data: responseData
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};
// Update a following
const updateFollowing = async (req, res) => {
    const { id, user, manga, isReturnNewData } = req.body;
    try {
        const updatedFollowing = await FollowingModel_1.default.findByIdAndUpdate(id, { user, manga }, { new: true });
        if (!updatedFollowing) {
            return res.status(404).json({ success: false, message: 'Following not found.' });
        }
        res.status(200).json({
            success: true,
            message: 'Following updated successfully.',
            data: isReturnNewData ? updatedFollowing : null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};
const deleteFollowing = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFollowing = await FollowingModel_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
};
const getUserLibrary = async (req, res) => {
    const userId = new mongoose_1.default.Types.ObjectId(req.query.id);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    try {
        const totalFollowings = await FollowingModel_1.default.countDocuments({ user: userId });
        const followingList = await FollowingModel_1.default.aggregate([
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
                $project: {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving followings', error: error });
    }
};
const deleteFollowingsByMangaId = async (req, res) => {
    const { idManga } = req.params; // Assuming idManga is passed as a route parameter
    if (!idManga) {
        return res.status(400).json({ success: false, message: "Manga ID is required." });
    }
    try {
        const result = await FollowingModel_1.default.deleteMany({ manga: idManga });
        res.status(200).json({
            success: true,
            message: `${result.deletedCount} followings deleted successfully.`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error: ", error: error });
    }
};
exports.default = {
    createManyFollowing,
    getPaginatedFollowing,
    getAdvancedPaginatedFollowing,
    createFollowing,
    updateFollowing,
    deleteFollowing,
    getUserLibrary,
    deleteFollowingsByMangaId
};
