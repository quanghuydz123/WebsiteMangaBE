import asyncHandler from 'express-async-handler';
import dotenv, { populate } from 'dotenv';
import mongoose from 'mongoose';
import MangaModel from '../models/MangaModel';
import { Request, Response } from 'express';

dotenv.config();

const createManyManga = asyncHandler(async (req: Request, res: Response) => {
    const { tb_Manga } = req.body;

    await Promise.all(tb_Manga.map(async (manga: { _id: string }) => {
        await MangaModel.create({
            ...manga,
            _id: new mongoose.Types.ObjectId(manga._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
    const {searchValue,fillterGenre,fillterAuthor,fillterPublisher,sortType,page=1,limit=20,status}:{searchValue?:string,fillterGenre?:string,
        sortType?:'ascName' | 'descName' | 'latest-story' | 'most-viewed' ,page?:number,limit?:number,
        fillterAuthor?:string,fillterPublisher?:string,status?:number
    } = req.query
    // const skip: number = (page - 1) * limit; // Calculate how many items to skip
    const filter:any = {}
    const sort:any = {}
    if(searchValue){
        const regex = searchValue && new RegExp(searchValue , 'i')
        filter.name = {'$regex': regex}
    }
    if(fillterGenre){
        filter.genres = fillterGenre
    }
    if(fillterAuthor){
        filter.author = fillterAuthor

    }
    if(status){
        filter.status = status
    }
    if(fillterPublisher){
        filter.publisher = fillterPublisher

    }
    if(sortType){
        if(sortType==='descName'){
            sort.name = -1
        }else if (sortType==='ascName'){
            sort.name = 1
        }else if(sortType==='latest-story'){
            sort.createdAt = -1
        }else{
            sort.views = -1
        }
    }
    const options = {
        page: page,
        limit: limit,
        sort:sort,
        populate:"author publisher genres"
    }
    // const manga = await MangaModel.find(filter).populate('author publisher genres').skip(skip).limit(limit).sort(sort);
    const manga = await MangaModel.paginate(filter,options)
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga,
    });
});

const getMangaById = asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.query
    if(id){
        const manga = await MangaModel.findById(id).populate('author publisher genres')
        if(!manga){   
            res.status(402)
            throw new Error('manga không tồn tại')
        }
        res.status(200).json({
            status: 200,
            message: "Thành công",
            manga
        });
    }else{
        res.status(402)
        throw new Error('id không có')
        
    }
});


const updateMangaById = asyncHandler(async (req: Request, res: Response) => {
    const {_id} = req.body
    const data = {
        ...req.body,
    }
    delete data._id
    const updateManga = await MangaModel.findByIdAndUpdate(_id,data,{new:true})
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga:updateManga
    });
});

const createManga = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const manga = await MangaModel.create(data);
    res.status(200).json({
        status: 200,
        message: "Thành công",
        manga
    });
});

const increaseView = asyncHandler(async (req: Request, res: Response) => {
    const {_id} = req.body
    let manga = await MangaModel.findById(_id)
    if(manga){
        const view = manga.views + 1
        if(view){
            const mangaUpdate = await MangaModel.findByIdAndUpdate(_id,{views:view})
            if(mangaUpdate){
                res.status(200).json({
                    status: 200,
                    message: "Thành công",
                    manga:mangaUpdate
                });
            }
        }
    }else{
        res.status(402)
        throw new Error('manga không tồn tại')
    }
});
export default {
    createManyManga,
    getAll,
    getMangaById,
    updateMangaById,
    createManga,
    increaseView
};
