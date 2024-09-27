import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import NotificationModel from '../models/NotificationModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyNotification = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Notification } = req.body;

    await Promise.all(tb_Notification.map(async (notification: { _id: string }) => {
        await NotificationModel.create({
            ...notification,
            _id: new mongoose.Types.ObjectId(notification._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await NotificationModel.find().populate('user')

    res.status(200).json({
        status: 200,
        message: "Thành công",
        notifications
    });
});


export default {
    createManyNotification,
    getAll
};
