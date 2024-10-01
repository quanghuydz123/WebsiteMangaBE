"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const RatingModel_1 = __importDefault(require("../models/RatingModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyRating = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Rating } = req.body;
    await Promise.all(tb_Rating.map(async (rating) => {
        await RatingModel_1.default.create({
            ...rating,
            _id: new mongoose_1.default.Types.ObjectId(rating._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getAll = (0, express_async_handler_1.default)(async (req, res) => {
    const ratings = await RatingModel_1.default.find().populate('user manga');
    res.status(200).json({
        status: 200,
        message: "Thành công",
        ratings
    });
});
exports.default = {
    createManyRating,
    getAll
};
