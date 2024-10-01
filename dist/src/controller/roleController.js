"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const RoleModel_1 = __importDefault(require("../models/RoleModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyRole = (0, express_async_handler_1.default)(async (req, res) => {
    const { roles } = req.body;
    const roleNews = []; // Use a specific type if you have one for roleNew
    await Promise.all(roles.map(async (role) => {
        const roleNew = await RoleModel_1.default.create({
            _id: new mongoose_1.default.Types.ObjectId(role._id),
            name: role.name
        });
        if (roleNew) {
            roleNews.push(roleNew);
        }
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
        roleNews
    });
});
const getAll = (0, express_async_handler_1.default)(async (req, res) => {
    const role = await RoleModel_1.default.find();
    res.status(200).json({
        status: 200,
        message: "Thành công",
        role
    });
});
exports.default = {
    createManyRole,
    getAll
};
