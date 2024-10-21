import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import NotificationModel, { Notification } from '../models/NotificationModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { GenericResponse } from '../models/GenericResponse';

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
    try {
        const notifications = await NotificationModel.find().populate('user');

        // Check if notifications were found
        if (!notifications || notifications.length === 0) {
            res.status(404).json({
                message: "No notifications found",
                data: null,
            });
            return;
        }

        res.status(200).json({
            message: "Thành công",
            data: notifications,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const createNotification = asyncHandler(async (req: Request, res: Response<GenericResponse<Notification | null>>): Promise<void> => {
    const { content, idUser } = req.body;

    try {
        const user = await UserModel.findById(idUser);
        if (!user) {
            res.status(404).json({
                message: 'Người dùng không tồn tại',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const notification = await NotificationModel.create({
            content,
            user: idUser,
        });

        res.status(201).json({
            message: "Thành công",
            data: notification,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

export default {
    createManyNotification,
    getAll,
    createNotification
};
