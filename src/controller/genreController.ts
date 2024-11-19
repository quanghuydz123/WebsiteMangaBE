import dotenv from 'dotenv';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { IAPIParams } from '../models/APIPramsModel';
import { GenericResponse } from '../models/GenericResponse';
import GenreModel, { Genre } from '../models/GenreModel';
import cacheController from './cacheController';

dotenv.config();

const CURRENT_MODEL_NAME = "genres" as const;

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

const getPaginatedGenres = async (req: Request, res: Response): Promise<void> => {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const skip: number = (page - 1) * limit;

    const apiParam: IAPIParams = {
        apiRoute: "/genres/get-page",
        params: `${page}-${limit}`
    }

    try {
        const etag = await cacheController.getEtag(req, apiParam, CURRENT_MODEL_NAME);
        
        if (etag === null) {
            console.log("send 304");
            
            res.status(304).send();
            return;
        }

        const totalGenres = await GenreModel.countDocuments();
        const genresList = await GenreModel.find().skip(skip).limit(limit);

        // Build the response
        const response: GenericResponse<{
            page: number;
            totalGenres: number;
            totalPages: number;
            genres: Genre[]; // Adjust the type based on your Genre model
        }> = {
            message: "Genres retrieved successfully",
            data: {
                page,
                totalGenres,
                totalPages: Math.ceil(totalGenres / limit),
                genres: genresList,
            },
        };

        // Set the ETag header
        cacheController.controllCacheHeader(res,etag);
        console.log("send 200");
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving genres',
            data: null,
        });
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

        const response: GenericResponse<{
            page: number;
            totalGenres: number;
            totalPages: number;
            genres: Genre[]; // Adjust the type based on your Genre model
        }> = {
            message: "Genres retrieved successfully",
            data: {
                page: pageNumber,
                totalGenres,
                totalPages: Math.ceil(totalGenres / limitNumber),
                genres: genresList,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving genres',
            data: null,
        });
    }
};

const createGenre = async (req: Request, res: Response) => {
    const { name, slug, isReturnNewData } = req.body;

    if (!name || !slug) {
        // Create a consistent error response object
        const errorResponse: GenericResponse<null> = {
            message: 'Name and slug are required.',
            data: null,
        };
        return res.status(400).json(errorResponse);
    }

    const genre = new GenreModel({ name, slug });

    try {
        const newGenre = await genre.save();

        const responseData = isReturnNewData ? newGenre : null;

        const response: GenericResponse<Genre | null> = {
            message: 'Genre created successfully.',
            data: responseData,
        };
        cacheController.upsertModelModified(CURRENT_MODEL_NAME)
        res.status(201).json(response);
    } catch (error) {
        // Create a consistent error response object
        const errorResponse: GenericResponse<null> = {
            message: 'Server error: ' + JSON.stringify(error), // Include the error message for more context
            data: null,
        };
        res.status(500).json(errorResponse);
    }
};

const updateGenre = async (req: Request, res: Response) => {
    const { id, name, slug, isDeleted = false, isReturnNewData = true } = req.body;

    try {
        const updatedGenre: Genre | null = await GenreModel.findByIdAndUpdate(
            id,
            { name, slug, isDeleted },
            { new: true }
        );

        if (!updatedGenre) {
            const notFoundResponse: GenericResponse<null> = {
                message: 'Genre not found.',
                data: null,
            };
            return res.status(404).json(notFoundResponse);
        }

        const response: GenericResponse<Genre | null> = {
            message: 'Genre updated successfully.',
            data: isReturnNewData ? updatedGenre : null,
        };
        cacheController.upsertModelModified(CURRENT_MODEL_NAME);
        res.status(200).json(response);
    } catch (error) {
        const errorResponse: GenericResponse<null> = {
            message: 'Server error: ' + JSON.stringify(error),
            data: null,
        };
        res.status(500).json(errorResponse);
    }
};

const totalGenre = asyncHandler(async (req: Request, res: Response<GenericResponse<number | null>>): Promise<void> => {
    const totalGenre = await GenreModel.find().countDocuments()
    res.status(200).json({
        message: "Thành công",
        data: totalGenre,
    });
});
export default {
    createManyGenre,
    getPaginatedGenres,
    getAdvancedPaginatedGenres,
    createGenre,
    updateGenre,
    totalGenre
};
