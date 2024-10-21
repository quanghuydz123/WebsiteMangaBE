import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import PublisherModel, { Publisher } from '../models/PublisherModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';

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


const getAll = asyncHandler(async (req: Request, res: Response<GenericResponse<Publisher[] | null>>): Promise<void> => {
    try {
        const publishers = await PublisherModel.find();

        // Check if any publishers are found
        if (!publishers || publishers.length === 0) {
            res.status(404).json({
                message: "No publishers found",
                data: null,
            });
            return; // Early return to indicate completion
        }

        res.status(200).json({
            message: "Thành công",
            data: publishers,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const createPublisher = asyncHandler(async (req: Request, res: Response<GenericResponse<Publisher | null>>): Promise<void> => {
    const { name } = req.body;

    try {
        const publisher = await PublisherModel.findOne({ name: { $regex: new RegExp(name, 'i') } });

        if (publisher) {
            res.status(409).json({  // 409 Conflict for existing resource
                message: 'Đã có tên nhà xuất bản này trong hệ thống',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const publisherNew = await PublisherModel.create({ name });

        res.status(201).json({  // 201 Created for new resource
            message: "Thành công",
            data: publisherNew,
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
    createManyPublisher,
    getAll,
    createPublisher
};
