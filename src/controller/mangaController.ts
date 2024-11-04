import asyncHandler from 'express-async-handler';
import dotenv, { populate } from 'dotenv';
import mongoose from 'mongoose';
import MangaModel from '../models/MangaModel';
import { Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';
import fileController from '../controller/fileController';
dotenv.config();


interface MangaResponse {
    _id: mongoose.Types.ObjectId;
    name: string;
    summary: string;
    imageUrl: string;
    authorName: string[];
    genreName: string[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
    // Ensure _id is provided
    if (!_id) {
        res.status(400); // Bad Request
        throw new Error('ID không có');
    }

    const data = {
        ...req.body,
    };

    delete data._id; // Remove _id from data to avoid conflicts

    const updateManga = await MangaModel.findByIdAndUpdate(_id, data, { new: true })
        .populate('author', '_id name isDeleted')
        .populate('publisher', '_id name isDeleted')
        .populate('genres', '_id name slug isDeleted');

    if (!updateManga) {
        res.status(404); // Not Found
        throw new Error('Manga không tồn tại');
    }

    const response: GenericResponse<typeof updateManga> = {
        message: "Thành công",
        data: updateManga,
    };
    if (data.name && data.name !== updateManga.name) {
        fileController.changeFolderName(data.name, updateManga.name);
    }
    res.status(200).json(response);
});

const createManga = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const data = req.body;

    try {
        const manga = await MangaModel.create(data);
        const populatedManga = await MangaModel.findById(manga._id)
            .populate('author', '_id name isDeleted')
            .populate('publisher', '_id name isDeleted')
            .populate('genres', '_id name slug isDeleted');;
        const response: GenericResponse<typeof populatedManga> = {
            message: "Thành công",
            data: populatedManga,
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

const getPosters = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
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
        select: "imageUrl status name",
        populate: [
            {
                path: 'author',
                select: 'name -_id'
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


const StatisticsByView = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { page = 1, limit = 10 } = req.query
    const options: any = {
        page,
        limit,
        sort: { views: -1 },
        select: "_id name views",
    };
    const manga = await MangaModel.paginate({}, options);
    res.status(200).json({
        message: 'Thành công',
        data: manga
    });
});

const StatisticsByFollow = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { page = 1, limit = 10 } = req.query
    const options: any = {
        page,
        limit,
        sort: { followersCount: -1 },
        select: "_id name followersCount",
    };
    const manga = await MangaModel.paginate({}, options);
    res.status(200).json({
        message: 'Thành công',
        data: manga
    });
});

const StatisticsByRating = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { page = 1, limit = 10 } = req.query
    const options: any = {
        page,
        limit,
        sort: { rating: -1 },
        select: "_id name rating",
    };
    const manga = await MangaModel.paginate({}, options);
    res.status(200).json({
        message: 'Thành công',
        data: manga
    });
});

const deleteManga = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>) => {
    const { idManga } = req.body
    if (!idManga) {
        res.status(400);
        throw new Error('idManga không có');
    }
    const manga = await MangaModel.findById(idManga)
    if (manga) {
        const mangaUpdate = await MangaModel.findByIdAndUpdate(idManga, { isDeleted: !manga.isDeleted }, { new: true });
        res.status(200).json({
            message: 'Thành công',
            data: mangaUpdate
        });
    } else {
        res.status(400);
        throw new Error('manga không tồn tại');
    }
});


const getAllAdminManga = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const options = {
            page: Number(page),
            limit: Number(limit),
            populate: [
                { path: 'author', select: 'name' },
                { path: 'genres', select: 'name' }
            ]
        };

        const paginatedManga = await MangaModel.paginate({}, options);

        const mangaResponse: MangaResponse[] = paginatedManga.docs.map((manga) => ({
            _id: manga._id,
            name: manga.name,
            summary: manga.summary,
            imageUrl: manga.imageUrl,
            authorName: manga.author.map((author: any) => author.name),
            genreName: manga.genres.map((genre: any) => genre.name),
            isDeleted: manga.isDeleted,
            createdAt: manga.createdAt,
            updatedAt: manga.updatedAt,
        }));

        const response: GenericResponse<any> = {
            message: 'Fetched manga successfully',
            data: {
                docs: mangaResponse,
                totalDocs: paginatedManga.totalDocs,
                limit: paginatedManga.limit,
                totalPages: paginatedManga.totalPages,
                page: paginatedManga.page,
                pagingCounter: paginatedManga.pagingCounter,
                hasPrevPage: paginatedManga.hasPrevPage,
                hasNextPage: paginatedManga.hasNextPage,
                prevPage: paginatedManga.prevPage,
                nextPage: paginatedManga.nextPage
            },
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching manga',
            data: JSON.stringify(error)
        });
    }
};
export const updateAdminManga = async (req: Request, res: Response) => {
    try {
        const { _id, updatedData } = req.body;

        // Check if _id and updatedData are provided
        if (!_id || !updatedData) {
            return res.status(400).json({
                message: '_id and updatedData are required',
                data: null
            });
        }

        // Find manga by ID and update with the provided data
        const manga = await MangaModel.findByIdAndUpdate(_id, updatedData, {
            new: true, // Returns the updated document
            runValidators: true // Ensures validation rules apply to the updated data
        }).populate([
            { path: 'author', select: 'name' },
            { path: 'genres', select: 'name' }
        ]);

        // Check if the manga was found and updated
        if (!manga) {
            return res.status(404).json({
                message: 'Manga not found',
                data: null
            });
        }

        // Format the response data as MangaResponse
        const mangaResponse: MangaResponse = {
            _id: manga._id,
            name: manga.name,
            summary: manga.summary,
            imageUrl: manga.imageUrl,
            authorName: manga.author.map((author: any) => author.name),
            genreName: manga.genres.map((genre: any) => genre.name),
            isDeleted: manga.isDeleted,
            createdAt: manga.createdAt,
            updatedAt: manga.updatedAt,
        };

        // Return the success response with the updated manga data
        const response: GenericResponse<MangaResponse> = {
            message: 'Manga updated successfully',
            data: mangaResponse
        };

        res.status(200).json(response);
    } catch (error) {
        // Return an error response in case of failure
        res.status(500).json({
            message: 'Error updating manga',
            data: JSON.stringify(error)
        });
    }
};


export default {
    getAllAdminManga,
    updateAdminManga,
    createManyManga,
    getAll,
    getMangaById,
    updateMangaById,
    createManga,
    increaseView,
    getPosters,
    StatisticsByView,
    StatisticsByFollow,
    StatisticsByRating,
    deleteManga
};
