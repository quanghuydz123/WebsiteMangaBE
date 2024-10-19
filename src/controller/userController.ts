import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import UserModel, { User } from '../models/UserModel';
import ChapterModel from '../models/ChapterModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
dotenv.config();
const getJsonWebToken = async (email:string,id:string,role:any) => {
    const payload = {
        email,
        id,
        role:role.name   
    }
    const token = jwt.sign(payload,process.env.SECRET_KEY ?? 'du_phong',{expiresIn:'7d'})
    return token
}

const getAll = asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find().populate('role')
    .populate({
        path:'reading_history',
        select:'_id title manga',
        populate:[
            { path: 'manga', select:'_id name imageUrl'},
        ]
    });

    res.status(200).json({
        status: 200,
        message: "Thành công",
        data:users
    });
});

const createManyUser = asyncHandler(async (req: Request, res: Response) => {
    const { tb_User } = req.body;
    const userNews : User []= [];

    await Promise.all(tb_User.map(async (user: { _id: string }) => {
        console.log(user);
        const userNew = await UserModel.create({
            ...user,
            _id: new mongoose.Types.ObjectId(user._id),
        });

        if (userNew) {
            userNews.push(userNew);
        }
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
        data:userNews
    });
});


const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.query
    if(id){
        const user = await UserModel.findById(id).populate('role')
        .populate({
            path:'reading_history',
            select:'_id title manga',
            populate:[
                { path: 'manga', select:'_id name imageUrl'},
            ]
        });
        if(!user){   
            res.status(402)
            throw new Error('user không tồn tại')
        }
        res.status(200).json({
            status: 200,
            message: "Thành công",
            data:user
        });
    }else{
        res.status(402)
        throw new Error('id không có')
        
    }
    
});


const login = asyncHandler(async (req: Request, res: Response) => {
    const {email,password}:{email:string,password:string} = req.body
    const existingUser = await UserModel.findOne({email}).populate('role')
    if(!existingUser){
        res.status(402)
        throw new Error('Email chưa được đăng ký')
    }
    const isMathPassword =  existingUser?.password && await bcrypt.compare(password,existingUser.password)
    if(!isMathPassword){
        res.status(403)
        throw new Error('Email hoặc mật khẩu không chỉnh xác!!!')
    }
    res.status(200).json({
        message:"Đăng nhập thành công",
        status:200,
        data:{
            existingUser,
        },
        accesstoken: await getJsonWebToken(existingUser.email,existingUser.id,existingUser.role),    
    })
});


const register = asyncHandler(async (req: Request, res: Response) => {
    const {email,password,comfirmPassword,userName} = req.body
    const existingUser = await UserModel.findOne({email})
    if(existingUser){
        res.status(402)
        throw new Error('Email đã được đăng ký!!!')
    }
    if(password !== comfirmPassword){
        res.status(403)
        throw new Error('Mật khẩu nhập lại không khớp!!!')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new UserModel({
        email,
        userName:userName || 'Người dùng',
        password:hashedPassword,
        role:'66f18ac5ab25c97ba8d69efe',
        account_type:"account"
    })
    await newUser.save()
    res.status(200).json({
        message: "Đăng ký thành công",
        status:200,
        data:{
            newUser
        }
    })
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const {email,password,comfirmPassword} = req.body
    const existingUser = await UserModel.findOne({email})
    if(!existingUser){
        res.status(402)
        throw new Error('Email chưa được đăng ký!!!')
    }
    if(password !== comfirmPassword){
        res.status(403)
        throw new Error('Mật khẩu nhập lại không chính xác!!!')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const updateUser = await UserModel.findByIdAndUpdate(existingUser.id,{password:hashedPassword},{new:true})
    res.status(200).json({
        message: "Đổi mật khẩu thành công",
        status:200,
        data:{
            code: updateUser  
        }
    })
});

const loginGoogle = asyncHandler(async (req: Request, res: Response) => {
    const {email,name,photo}:{email:string,name:string,photo:string} = req.body
    const existingUser = await UserModel.findOne({email,account_type:'google'}).populate('role')
    if(existingUser){
        res.status(200).json({
            message:"Đăng nhập thành công",
            status:200,
            data:{
                existingUser,
            },
            accesstoken: await getJsonWebToken(existingUser.email,existingUser.id,existingUser.role),    
        })
    }
    else{
        const newUser = new UserModel({
            email,
            userName:name || 'Người dùng',
            role:'66f18ac5ab25c97ba8d69efe',
            account_type:"google"
            
        })
        await newUser.save()
        res.status(200).json({
            message:"Đăng nhập thành công",
            status:200,
            data:{
                newUser,
            },
            accesstoken: await getJsonWebToken(newUser.email,newUser.id,newUser.role),    
        })

    }

    res.status(200).json({
        message:"Đăng nhập thành công",
        status:200,
        data:{
            existingUser
    }
    })
});


const addReadingHistory = asyncHandler(async (req: Request, res: Response) => {
    const {idUser,idChapter} = req.body
    const user = await UserModel.findById(idUser)
    const chapter = await ChapterModel.findById(idChapter)
    if(user && chapter){
        const readingHistoryNew = [...user.reading_history]
        const index = readingHistoryNew.findIndex((item)=> item.toString() === idChapter)
        if(index !== -1){
            readingHistoryNew.splice(index,1)
            readingHistoryNew.unshift(idChapter)
            const updateUser = await UserModel.findByIdAndUpdate(idUser,{reading_history:readingHistoryNew},{new:true})
            res.status(200).json({
                message: "Thành công",
                status:200,
                data:updateUser
            })
        }else{
            readingHistoryNew.unshift(idChapter)
            const updateUser = await UserModel.findByIdAndUpdate(idUser,{reading_history:readingHistoryNew},{new:true})
            res.status(200).json({
                message: "Thành công",
                status:200,
                data:updateUser
            })
        }
    }else{
        res.status(402)
        throw new Error('user hoặc chapter không tồn tại')
    }
    
});

export default {
    getAll,
    createManyUser,
    getUserById,
    login,
    register,
    changePassword,
    loginGoogle,
    addReadingHistory
};
