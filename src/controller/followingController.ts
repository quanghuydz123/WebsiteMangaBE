import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import FollowingModel from '../models/FollowingModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Following } = req.body;

    await Promise.all(tb_Following.map(async (following: { _id: string }) => {
        await FollowingModel.create({
            ...following,
            _id: new mongoose.Types.ObjectId(following._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

export default {
    createManyFollowing,
};
