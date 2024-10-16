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
        data:publishers
    });
});

const createPublisher = asyncHandler(async (req: Request, res: Response) => {
    const {name} = req.body
    const publisher = await PublisherModel.findOne({name: { $regex: new RegExp(name, 'i') }})
    if(publisher){
        res.status(402)
        throw new Error('Đã có tên nhà xuát bản này trong hệ thống')
    }else{
        const publisherNew = await PublisherModel.create({name})
        res.status(200).json({
            status: 200,
            message: "Thành công",
            data:publisherNew
        });
    
    }
});
export default {
    createManyPublisher,
    getAll,
    createPublisher
};
