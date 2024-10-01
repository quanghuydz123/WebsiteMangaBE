"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const NotificationModel_1 = __importDefault(require("../models/NotificationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyNotification = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_Notification } = req.body;
    await Promise.all(tb_Notification.map(async (notification) => {
        await NotificationModel_1.default.create({
            ...notification,
            _id: new mongoose_1.default.Types.ObjectId(notification._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getAll = (0, express_async_handler_1.default)(async (req, res) => {
    const notifications = await NotificationModel_1.default.find().populate('user');
    res.status(200).json({
        status: 200,
        message: "Thành công",
        notifications
    });
});
exports.default = {
    createManyNotification,
    getAll
};