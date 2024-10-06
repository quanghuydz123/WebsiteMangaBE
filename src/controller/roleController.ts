import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import RoleModel from '../models/RoleModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import FollowingModel from '../models/FollowingModel';

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

const getAll = asyncHandler(async (req: Request, res: Response) => {
    // const role = await FollowingModel.aggregate(
    //     [
    //         {
    //             $group: {
    //                 _id: "$manga", // Nhóm theo manga
    //                 totalFollows: { $sum: 1 } // Đếm số lượng follow
    //               }
    //         },
    //         // {
    //         //     // Kết hợp với bảng Manga để lấy thông tin manga chi tiết
    //         //     $lookup: {
    //         //       from: "mangas", // Tên collection của Manga trong MongoDB
    //         //       localField: "_id", // Trường _id của Manga (sau khi nhóm)
    //         //       foreignField: "_id", // Trường _id trong bảng Manga
    //         //       as: "mangaDetails" // Tên trường để chứa thông tin manga sau khi lookup
    //         //     }
    //         //   },
    //     ]
    // )
    const role = await RoleModel.find()
    res.status(200).json({
        status: 200,
        message: "Thành công",
        role
    });
});
export default {
    createManyRole,
    getAll
};
