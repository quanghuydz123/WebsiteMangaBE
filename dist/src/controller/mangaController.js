"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const MangaModel_1 = __importDefault(require("../models/MangaModel"));
dotenv_1.default.config();
const createManyManga = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Manga } = req.body;
    await Promise.all(tb_Manga.map(async (manga) => {
        await MangaModel_1.default.create({
            ...manga,
            _id: new mongoose_1.default.Types.ObjectId(manga._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getAll = (0, express_async_handler_1.default)(async (req, res) => {
    const { searchValue, fillterGenre, fillterAuthor, fillterPublisher, sortType, page = 1, limit = 20, status } = req.query;
    // const skip: number = (page - 1) * limit; // Calculate how many items to skip
    const filter = {};
    const sort = {};
    if (searchValue) {
        const regex = searchValue && new RegExp(searchValue, 'i');
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
        if (sortType === 'descName') {
            sort.name = -1;
        }
        else if (sortType === 'ascName') {
            sort.name = 1;
        }
        else if (sortType === 'latest-story') {
            sort.createdAt = -1;
        }
        else {
            sort.views = -1;
        }
    }
    const options = {
        page: page,
        limit: limit,
        sort: sort,
        populate: "author publisher genres"
    };
    // const manga = await MangaModel.find(filter).populate('author publisher genres').skip(skip).limit(limit).sort(sort);
    const manga = await MangaModel_1.default.paginate(filter, options);
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga,
    });
});
const getMangaById = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.query;
    if (id) {
        const manga = await MangaModel_1.default.findById(id).populate('author publisher genres');
        if (!manga) {
            res.status(402);
            throw new Error('manga không tồn tại');
        }
        res.status(200).json({
            status: 200,
            message: "Thành công",
            manga
        });
    }
    else {
        res.status(402);
        throw new Error('id không có');
    }
});
const updateMangaById = (0, express_async_handler_1.default)(async (req, res) => {
    const { _id } = req.body;
    const data = {
        ...req.body,
    };
    delete data._id;
    const updateManga = await MangaModel_1.default.findByIdAndUpdate(_id, data, { new: true });
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga: updateManga
    });
});
const createManga = (0, express_async_handler_1.default)(async (req, res) => {
    const data = req.body;
    const manga = await MangaModel_1.default.create(data);
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga
    });
});
const increaseView = (0, express_async_handler_1.default)(async (req, res) => {
    const { _id } = req.body;
    let manga = await MangaModel_1.default.findById(_id);
    if (manga) {
        const view = manga.views + 1;
        if (view) {
            const mangaUpdate = await MangaModel_1.default.findByIdAndUpdate(_id, { views: view });
            if (mangaUpdate) {
                res.status(200).json({
                    status: 200,
                    message: "Thành công",
                    manga: mangaUpdate
                });
            }
        }
    }
    else {
        res.status(402);
        throw new Error('manga không tồn tại');
    }
});
exports.default = {
    createManyManga,
    getAll,
    getMangaById,
    updateMangaById,
    createManga,
    increaseView
};
