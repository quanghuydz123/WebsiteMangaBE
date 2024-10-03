import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import RatingModel from '../models/RatingModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import MangaModel from '../models/MangaModel';

dotenv.config();

const createManyRating = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Rating } = req.body;

    await Promise.all(tb_Rating.map(async (rating: { _id: string }) => {
        await RatingModel.create({
            ...rating,
            _id: new mongoose.Types.ObjectId(rating._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
    const ratings = await RatingModel.find().populate('user manga')

    res.status(200).json({
        status: 200,
        message: "Thành công",
        ratings
    });
});

const toggleRating = asyncHandler(async (req: Request, res: Response) => {
    const {user,manga,star} = req.body
    const checkUser = await UserModel.findById(user)
    if(!checkUser){
        res.status(402)
        throw new Error('user không hợp lệ')

    }
    const checkManga = await MangaModel.findById(manga)
    if(!checkManga){
        res.status(403)
        throw new Error('manga không hợp lệ')
    }
    const rating = await RatingModel.findOne({user,manga})
    if(rating){
        const updateRating = await RatingModel.findByIdAndUpdate(rating.id,{star},{new:true})
        const ratings = await RatingModel.aggregate([
            {
                $match:{manga:updateRating?.manga}
            },
            {
                $group:{
                    _id:'$manga',
                    avgStar:{$avg:'$star'}
                }

            }
        ])
        await MangaModel.findByIdAndUpdate(ratings[0]._id,{rating:ratings[0].avgStar},{new:true})
        res.status(200).json({
            status: 200,
            message: "Thành công",
            updateRating,

        });
    }else{
        const createRating = await RatingModel.create({
            user,
            manga,
            star
        })
        const ratings = await RatingModel.aggregate([
            {
                $match:{manga:createRating?.manga}
            },
            {
                $group:{
                    _id:'$manga',
                    avgStar:{$avg:'$star'}
                }

            }
        ])
        await MangaModel.findByIdAndUpdate(ratings[0]._id,{rating:ratings[0].avgStar},{new:true})
        res.status(200).json({
            status: 200,
            message: "Thành công",
            rating:createRating
        });
    }
});
export default {
    createManyRating,
    getAll,
    toggleRating
};
