import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import RatingModel, { Rating } from '../models/RatingModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import MangaModel from '../models/MangaModel';
import { GenericResponse } from '../models/GenericResponse';

dotenv.config();

const createManyRating = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Rating } = req.body;

    await Promise.all(tb_Rating.map(async (rating: { _id: string }) => {
        await RatingModel.create({
            ...rating,
            _id: new mongoose.Types.ObjectId(rating._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response<GenericResponse<Rating[] | null>>): Promise<void> => {
    try {
        const ratings = await RatingModel.find();

        // Check if any ratings are found
        if (!ratings || ratings.length === 0) {
            res.status(404).json({
                message: "No ratings found",
                data: null,
            });
            return; // Early return to indicate completion
        }

        res.status(200).json({
            message: "Thành công",
            data: ratings,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const toggleRating = asyncHandler(async (req: Request, res: Response<GenericResponse<Rating | null>>): Promise<void> => {
    const { user, manga, star } = req.body;

    try {
        const checkUser = await UserModel.findById(user);
        if (!checkUser) {
            res.status(400).json({
                message: 'User không hợp lệ',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const checkManga = await MangaModel.findById(manga);
        if (!checkManga) {
            res.status(400).json({
                message: 'Manga không hợp lệ',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const rating = await RatingModel.findOne({ user, manga });
        let updatedRating: Rating | null;

        if (rating) {
            // Update existing rating
            updatedRating = await RatingModel.findByIdAndUpdate(rating.id, { star }, { new: true });
        } else {
            // Create new rating
            updatedRating = await RatingModel.create({ user, manga, star });
        }

        // Check if updatedRating is valid before proceeding
        if (updatedRating) {
            // Calculate the average rating
            const ratings = await RatingModel.aggregate([
                {
                    $match: { manga: updatedRating.manga }
                },
                {
                    $group: {
                        _id: '$manga',
                        avgStar: { $avg: '$star' }
                    }
                }
            ]);

            // Update the manga with the new average rating if ratings exist
            if (ratings.length > 0) {
                await MangaModel.findByIdAndUpdate(ratings[0]._id, { rating: ratings[0].avgStar }, { new: true });
            }

            res.status(200).json({
                message: "Thành công",
                data: updatedRating,
            });
        } else {
            res.status(500).json({
                message: "Failed to update or create rating",
                data: null,
            });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});
export default {
    createManyRating,
    getAll,
    toggleRating
};
