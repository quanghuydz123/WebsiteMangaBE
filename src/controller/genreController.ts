import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import GenreModel from '../models/GenreModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyGenre = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Genre } = req.body;

    await Promise.all(tb_Genre.map(async (genre: { _id: string }) => {
        await GenreModel.create({
            ...genre,
            _id: new mongoose.Types.ObjectId(genre._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getPaginatedGenres = async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const skip: number = (page - 1) * limit;

    try {
        const totalGenres = await GenreModel.countDocuments();
        const genresList = await GenreModel.find().skip(skip).limit(limit);

        res.status(200).json({
            page,
            totalGenres,
            totalPages: Math.ceil(totalGenres / limit),
            genres: genresList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving genres', error });
    }
};

const getAdvancedPaginatedGenres = async (req: Request, res: Response) => {
    const { page, limit, filter } = req.query;

    const pageNumber: number = parseInt(page as string, 10) || 1;
    const limitNumber: number = parseInt(limit as string, 10) || 10;
    const skip: number = (pageNumber - 1) * limitNumber;

    try {
        const totalGenres = await GenreModel.countDocuments();
        const projection: any = {};
        if (filter) {
            const filterArray = (filter as string).split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1;
            });
        }

        const genresList = await GenreModel.find().select(projection).skip(skip).limit(limitNumber);

        res.status(200).json({
            page: pageNumber,
            totalGenres,
            totalPages: Math.ceil(totalGenres / limitNumber),
            genres: genresList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving genres', error });
    }
};

const createGenre = async (req: Request, res: Response) => {
    const { name, slug, isReturnNewData } = req.body;

    if (!name || !slug) {
        return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }

    const genre = new GenreModel({ name, slug });

    try {
        const newGenre = await genre.save();

        const responseData = isReturnNewData ? newGenre : null;

        res.status(201).json({
            success: true,
            message: 'Genre created successfully.',
            data: responseData,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ', error: error });
    }
};

const updateGenre = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, isDeleted, isReturnNewData } = req.body;

    try {
        const updatedGenre = await GenreModel.findByIdAndUpdate(
            id,
            { name, slug, isDeleted },
            { new: true }
        );

        if (!updatedGenre) {
            return res.status(404).json({ success: false, message: 'Genre not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Genre updated successfully.',
            data: isReturnNewData ? updatedGenre : null,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ', error: error });
    }
};
export default {
    createManyGenre,
    getPaginatedGenres,
    getAdvancedPaginatedGenres,
    createGenre,
    updateGenre
};
