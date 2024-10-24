import asyncHandler from 'express-async-handler';
import dotenv, { populate } from 'dotenv';
import mongoose from 'mongoose';
import MangaModel from '../models/MangaModel';
import { Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';

dotenv.config();

const createManyManga = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Manga } = req.body;

    await Promise.all(tb_Manga.map(async (manga: { _id: string }) => {
        await MangaModel.create({
            ...manga,
            _id: new mongoose.Types.ObjectId(manga._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const {
        searchValue,
        fillterGenre,
        fillterAuthor,
        fillterPublisher,
        sortType,
        page = 1,
        limit = 20,
        status
    }: {
        searchValue?: string;
        fillterGenre?: string;
        sortType?: 'ascName' | 'descName' | 'latest-story' | 'most-viewed' | 'follow' | 'star';
        page?: number;
        limit?: number;
        fillterAuthor?: string;
        fillterPublisher?: string;
        status?: number;
    } = req.query;

    const filter: any = {};
    const sort: any = {};

    if (searchValue) {
        const regex = new RegExp(searchValue, 'i');
        filter.name = { '$regex': regex };
    }
    if (fillterGenre) {
        filter.genres = fillterGenre;
    }
    if (fillterAuthor) {
        filter.author = fillterAuthor;
    }
    if (status) {
        filter.status = status;
    }
    if (fillterPublisher) {
        filter.publisher = fillterPublisher;
    }
    if (sortType) {
        switch (sortType) {
            case 'descName':
                sort.name = -1;
                break;
            case 'ascName':
                sort.name = 1;
                break;
            case 'latest-story':
                sort.createdAt = -1;
                break;
            case 'follow':
                sort.followersCount = -1;
                break;
            case 'star':
                sort.rating = -1;
                break;
            default:
                sort.views = -1;
        }
    }

    const options = {
        page,
        limit,
        sort,
        populate: [
            {
                path: 'author',
                select: '_id name isDeleted' 
            },
            {
                path: 'publisher',
                select: '_id name isDeleted' 
            },
            {
                path: 'genres',
                select: '_id name slug isDeleted' 
            }
        ]
    };

    const manga = await MangaModel.paginate(filter, options);

    const response: GenericResponse<typeof manga> = {
        message: "Thành công",
        data: manga,
    };

    res.status(200).json(response);
});

const getMangaById = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { id } = req.query;

    if (id) {
        const manga = await MangaModel.findById(id)
        .populate('author', '_id name isDeleted')
        .populate('publisher', '_id name isDeleted')
        .populate('genres', '_id name slug isDeleted')


        if (!manga) {
            res.status(404); // Updated to use the standard "Not Found" status
            throw new Error('Manga không tồn tại');
        }

        const response: GenericResponse<typeof manga> = {
            message: "Thành công",
            data: manga,
        };

        res.status(200).json(response);
    } else {
        res.status(400); // Updated to use the standard "Bad Request" status
        throw new Error('ID không có');
    }
});


const updateMangaById = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { _id } = req.body;
    console.log("req.body",req.body)
    // Ensure _id is provided
    if (!_id) {
        res.status(400); // Bad Request
        throw new Error('ID không có');
    }

    const data = {
        ...req.body,
    };

    delete data._id; // Remove _id from data to avoid conflicts

    const updateManga = await MangaModel.findByIdAndUpdate(_id, data, { new: true });

    if (!updateManga) {
        res.status(404); // Not Found
        throw new Error('Manga không tồn tại');
    }

    const response: GenericResponse<typeof updateManga> = {
        message: "Thành công",
        data: updateManga,
    };

    res.status(200).json(response);
});

const createManga = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const data = req.body;

    try {
        const manga = await MangaModel.create(data);

        const response: GenericResponse<typeof manga> = {
            message: "Thành công",
            data: manga,
        };

        res.status(201).json(response); // Updated to 201 for Created
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi tạo manga " + JSON.stringify(error),
            data: null,
        });
    }
});

const increaseView = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { _id } = req.body;

    // Ensure _id is provided
    if (!_id) {
        res.status(400); // Bad Request
        throw new Error('ID không có');
    }

    let manga = await MangaModel.findById(_id);

    if (manga) {
        const mangaUpdate = await MangaModel.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true });

        if (mangaUpdate) {
            const response: GenericResponse<typeof mangaUpdate> = {
                message: "Thành công",
                data: mangaUpdate,
            };
            res.status(200).json(response);
        } else {
            res.status(400).json({ // Handle potential error in update
                message: "Lỗi khi cập nhật lượt xem",
                data: null,
            });
        }
    } else {
        res.status(404); // Not Found
        throw new Error('Manga không tồn tại');
    }
});


export default {
    createManyManga,
    getAll,
    getMangaById,
    updateMangaById,
    createManga,
    increaseView,
    
};
