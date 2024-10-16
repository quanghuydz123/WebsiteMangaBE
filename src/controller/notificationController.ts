import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import NotificationModel from '../models/NotificationModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

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
        data:notifications
    });
});

const createNotification = asyncHandler(async (req: Request, res: Response) => {
    const {content,idUser} = req.body
    const user = await UserModel.findById(idUser)
    if(user){
        const notifications = await NotificationModel.create({
            content,
            user:idUser
        })
        res.status(200).json({
            status: 200,
            message: "Thành công",
            data:notifications
        });
    } else{
        res.status(402)
        throw new Error('Người dùng không tồn tại')
    }
    
});

export default {
    createManyNotification,
    getAll,
    createNotification
};
