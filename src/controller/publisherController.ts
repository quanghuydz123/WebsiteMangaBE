import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import PublisherModel from '../models/PublisherModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyPublisher = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Publisher } = req.body;

    await Promise.all(tb_Publisher.map(async (publisher: { _id: string }) => {
        await PublisherModel.create({
            ...publisher,
            _id: new mongoose.Types.ObjectId(publisher._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});


const getAll = asyncHandler(async (req: Request, res: Response) => {
    const publishers = await PublisherModel.find()
    res.status(200).json({
        status: 200,
        message: "Thành công",
        publishers
    });
});
export default {
    createManyPublisher,
    getAll
};
