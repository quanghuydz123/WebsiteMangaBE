"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const getJsonWebToken = async (email, id, role) => {
    const payload = {
        email,
        id,
        role: role.name
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY ?? 'du_phong', { expiresIn: '7d' });
    return token;
};
const getAll = (0, express_async_handler_1.default)(async (req, res) => {
    const users = await UserModel_1.default.find().populate('role reading_history');
    res.status(200).json({
        status: 200,
        message: "Thành công",
        users
    });
});
const createManyUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { tb_User } = req.body;
    const userNews = [];
    await Promise.all(tb_User.map(async (user) => {
        console.log(user);
        const userNew = await UserModel_1.default.create({
            ...user,
            _id: new mongoose_1.default.Types.ObjectId(user._id),
        });
        if (userNew) {
            userNews.push(userNew);
        }
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
        userNews
    });
});
const getUserById = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.query;
    if (id) {
        const user = await UserModel_1.default.findById(id).populate('role reading_history');
        if (!user) {
            res.status(402);
            throw new Error('user không tồn tại');
        }
        res.status(200).json({
            status: 200,
            message: "Thành công",
            user
        });
    }
    else {
        res.status(402);
        throw new Error('id không có');
    }
});
const login = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserModel_1.default.findOne({ email }).populate('role');
    if (!existingUser) {
        res.status(402);
        throw new Error('Email chưa được đăng ký');
    }
    const isMathPassword = existingUser?.password && await bcrypt_1.default.compare(password, existingUser.password);
    if (!isMathPassword) {
        res.status(403);
        throw new Error('Email hoặc mật khẩu không chỉnh xác!!!');
    }
    res.status(200).json({
        message: "Đăng nhập thành công",
        status: 200,
        user: {
            existingUser,
        },
        accesstoken: await getJsonWebToken(existingUser.email, existingUser.id, existingUser.role),
    });
});
const register = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password, comfirmPassword, userName } = req.body;
    const existingUser = await UserModel_1.default.findOne({ email });
    if (existingUser) {
        res.status(402);
        throw new Error('Email đã được đăng ký!!!');
    }
    if (password !== comfirmPassword) {
        res.status(403);
        throw new Error('Mật khẩu nhập lại không khớp!!!');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const newUser = new UserModel_1.default({
        email,
        userName: userName || 'Người dùng',
        password: hashedPassword,
        role: '66f18ac5ab25c97ba8d69efe',
        account_type: "account"
    });
    await newUser.save();
    res.status(200).json({
        message: "Đăng ký thành công",
        status: 200,
        user: {
            newUser
        }
    });
});
const changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password, comfirmPassword } = req.body;
    const existingUser = await UserModel_1.default.findOne({ email });
    if (!existingUser) {
        res.status(402);
        throw new Error('Email chưa được đăng ký!!!');
    }
    if (password !== comfirmPassword) {
        res.status(403);
        throw new Error('Mật khẩu nhập lại không chính xác!!!');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const updateUser = await UserModel_1.default.findByIdAndUpdate(existingUser.id, { password: hashedPassword }, { new: true });
    res.status(200).json({
        message: "Đổi mật khẩu thành công",
        status: 200,
        data: {
            code: updateUser
        }
    });
});
const loginGoogle = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, name, photo } = req.body;
    const existingUser = await UserModel_1.default.findOne({ email, account_type: 'google' }).populate('role');
    if (existingUser) {
        res.status(200).json({
            message: "Đăng nhập thành công",
            status: 200,
            user: {
                existingUser,
            },
            accesstoken: await getJsonWebToken(existingUser.email, existingUser.id, existingUser.role),
        });
    }
    else {
        const newUser = new UserModel_1.default({
            email,
            userName: name || 'Người dùng',
            role: '66f18ac5ab25c97ba8d69efe',
            account_type: "google"
        });
        await newUser.save();
        res.status(200).json({
            message: "Đăng nhập thành công",
            status: 200,
            user: {
                newUser,
            },
            accesstoken: await getJsonWebToken(newUser.email, newUser.id, newUser.role),
        });
    }
    res.status(200).json({
        message: "Đăng nhập thành công",
        status: 200,
        user: {
            existingUser
        }
    });
});
exports.default = {
    getAll,
    createManyUser,
    getUserById,
    login,
    register,
    changePassword,
    loginGoogle
};
