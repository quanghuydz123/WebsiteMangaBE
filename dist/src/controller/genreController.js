"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const GenreModel_1 = __importDefault(require("../models/GenreModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyGenre = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Genre } = req.body;
    await Promise.all(tb_Genre.map(async (genre) => {
        await GenreModel_1.default.create({
            ...genre,
            _id: new mongoose_1.default.Types.ObjectId(genre._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getPaginatedGenres = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    try {
        const totalGenres = await GenreModel_1.default.countDocuments();
        const genresList = await GenreModel_1.default.find().skip(skip).limit(limit);
        res.status(200).json({
            page,
            totalGenres,
            totalPages: Math.ceil(totalGenres / limit),
            genres: genresList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving genres', error });
    }
};
const getAdvancedPaginatedGenres = async (req, res) => {
    const { page, limit, filter } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    try {
        const totalGenres = await GenreModel_1.default.countDocuments();
        const projection = {};
        if (filter) {
            const filterArray = filter.split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1;
            });
        }
        const genresList = await GenreModel_1.default.find().select(projection).skip(skip).limit(limitNumber);
        res.status(200).json({
            page: pageNumber,
            totalGenres,
            totalPages: Math.ceil(totalGenres / limitNumber),
            genres: genresList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving genres', error });
    }
};
const createGenre = async (req, res) => {
    const { name, slug, isReturnNewData } = req.body;
    if (!name || !slug) {
        return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }
    const genre = new GenreModel_1.default({ name, slug });
    try {
        const newGenre = await genre.save();
        const responseData = isReturnNewData ? newGenre : null;
        res.status(201).json({
            success: true,
            message: 'Genre created successfully.',
            data: responseData,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ', error: error });
    }
};
const updateGenre = async (req, res) => {
    const { id, name, slug, isDeleted, isReturnNewData } = req.body;
    try {
        const updatedGenre = await GenreModel_1.default.findByIdAndUpdate(id, { name, slug, isDeleted }, { new: true });
        if (!updatedGenre) {
            return res.status(404).json({ success: false, message: 'Genre not found.' });
        }
        res.status(200).json({
            success: true,
            message: 'Genre updated successfully.',
            data: isReturnNewData ? updatedGenre : null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ', error: error });
    }
};
exports.default = {
    createManyGenre,
    getPaginatedGenres,
    getAdvancedPaginatedGenres,
    createGenre,
    updateGenre
};
