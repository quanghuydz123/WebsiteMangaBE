"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const PublisherModel_1 = __importDefault(require("../models/PublisherModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyPublisher = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Publisher } = req.body;
    await Promise.all(tb_Publisher.map(async (publisher) => {
        await PublisherModel_1.default.create({
            ...publisher,
            _id: new mongoose_1.default.Types.ObjectId(publisher._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getAll = (0, express_async_handler_1.default)(async (req, res) => {
    const publishers = await PublisherModel_1.default.find();
    res.status(200).json({
        status: 200,
        message: "Thành công",
        publishers
    });
});
exports.default = {
    createManyPublisher,
    getAll
};
