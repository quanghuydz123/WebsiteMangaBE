import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import UserModel, { User } from '../models/UserModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const getAll = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const createManyUser = asyncHandler(async (req: Request, res: Response) => {
    const { tb_User } = req.body;
    const userNews : User []= [];

    await Promise.all(tb_User.map(async (user: { _id: string }) => {
        console.log(user);
        const userNew = await UserModel.create({
            ...user,
            _id: new mongoose.Types.ObjectId(user._id),
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

export default {
    getAll,
    createManyUser
};
