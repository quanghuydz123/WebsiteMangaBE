import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import RoleModel from '../models/RoleModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

dotenv.config();

const createManyRole = asyncHandler(async (req: Request, res: Response) => {
    const { roles } = req.body;
    const roleNews: any[] = []; // Use a specific type if you have one for roleNew

    await Promise.all(roles.map(async (role: { _id: string; name: string }) => {
        const roleNew = await RoleModel.create({
            _id: new mongoose.Types.ObjectId(role._id),
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

export default {
    createManyRole,
};
