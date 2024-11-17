import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import UserModel, { IUser } from '../models/UserModel';
import ChapterModel from '../models/ChapterModel';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { GenericResponse } from '../models/GenericResponse';
dotenv.config();
const getJsonWebToken = async (email: string, id: string, role: any) => {
    const payload = {
        email,
        id,
        role: role.name
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY ?? 'du_phong', { expiresIn: '7d' })
    return token
}

const getAll = asyncHandler(async (req: Request, res: Response<any>): Promise<void> => {
    try {
        const users = await UserModel.find().populate('role')
            .populate({
                path: 'reading_history',
                select: '_id title manga',
                populate: [
                    { path: 'manga', select: '_id name imageUrl' },
                ]
            });

        // Check if any users are found
        if (!users || users.length === 0) {
            res.status(404).json({
                message: "No users found",
                data: null,
            });
            return; // Early return to indicate completion
        }

        res.status(200).json({
            message: "Thành công",
            data: users,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const createManyUser = asyncHandler(async (req: Request, res: Response) => {
    const { tb_User } = req.body;
    const userNews: IUser[] = [];

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
        data: userNews
    });
});


const getUserById = asyncHandler(async (req: Request, res: Response<GenericResponse<any>>): Promise<void> => {
    const { id } = req.query;

    if (id) {
        try {
            const user = await UserModel.findById(id).populate('role')
                .populate({
                    path: 'reading_history',
                    select: '_id title manga',
                    match: { isDeleted: false },
                    populate: [
                        { path: 'manga', select: '_id name imageUrl' },
                    ]
                });

            if (!user) {
                res.status(404).json({
                    message: 'User không tồn tại',
                    data: null,
                });
                return; // Early return to indicate completion
            }

            res.status(200).json({
                message: "Thành công",
                data: user,
            });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    } else {
        res.status(400).json({
            message: 'ID không có',
            data: null,
        });
    }
});


const login = asyncHandler(async (req: Request, res: Response<GenericResponse<{ existingUser: any; accessToken: string } | null>>): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email }).populate('role');
        if (!existingUser) {
            res.status(404).json({
                message: 'Email chưa được đăng ký',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const isMatchPassword = existingUser?.password && await bcrypt.compare(password, existingUser.password);
        if (!isMatchPassword) {
            res.status(403).json({
                message: 'Email hoặc mật khẩu không chính xác!!!',
                data: null,
            });
            return; // Early return to indicate completion
        }

        // Generate the access token
        const accessToken = await getJsonWebToken(existingUser.email, existingUser.id, existingUser.role);

        res.status(200).json({
            message: "Đăng nhập thành công",
            data: {
                existingUser,
                accessToken,
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});


const register = asyncHandler(async (req: Request, res: Response<GenericResponse<{ newUser: IUser } | null>>): Promise<void> => {
    const { email, password, confirmPassword, userName } = req.body; // Corrected spelling from comfirmPassword to confirmPassword

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(409).json({ // Use 409 Conflict for existing user
                message: 'Email đã được đăng ký!!!',
                data: null,
            });
            return; // Early return to indicate completion
        }

        if (password !== confirmPassword) {
            res.status(400).json({ // Use 400 Bad Request for mismatched passwords
                message: 'Mật khẩu nhập lại không khớp!!!',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            email,
            userName: userName || 'Người dùng',
            password: hashedPassword,
            role: '66f18ac5ab25c97ba8d69efe', // Consider defining roles as constants
            account_type: "account"
        });

        await newUser.save();

        res.status(201).json({ // Use 201 Created for a successful registration
            message: "Đăng ký thành công",
            data: {
                newUser
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const changePassword = asyncHandler(async (req: Request, res: Response<GenericResponse<{ code: IUser | null } | null>>): Promise<void> => {
    const { email, password, confirmPassword } = req.body; // Corrected spelling from comfirmPassword to confirmPassword

    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            res.status(404).json({ // Use 404 Not Found for non-existing user
                message: 'Email chưa được đăng ký!!!',
                data: null,
            });
            return; // Early return to indicate completion
        }

        if (password !== confirmPassword) {
            res.status(400).json({ // Use 400 Bad Request for mismatched passwords
                message: 'Mật khẩu nhập lại không chính xác!!!',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateUser = await UserModel.findByIdAndUpdate(existingUser.id, { password: hashedPassword }, { new: true });

        if (!updateUser) {
            res.status(500).json({ // Handle the case where the user update fails
                message: 'Không thể cập nhật mật khẩu',
                data: null,
            });
            return; // Early return to indicate completion
        }

        res.status(200).json({
            message: "Đổi mật khẩu thành công",
            data: {
                code: updateUser
            }
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const loginGoogle = asyncHandler(async (req: Request, res: Response<GenericResponse<{ user: IUser; accessToken: string } | null>>): Promise<void> => {
    const { email, name, photo }: { email: string; name: string; photo: string } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email, account_type: 'google' }).populate('role');

        if (existingUser) {
            const accessToken = await getJsonWebToken(existingUser.email, existingUser.id, existingUser.role);
            res.status(200).json({
                message: "Đăng nhập thành công",
                data: {
                    user: existingUser,
                    accessToken,
                },
            });
            return; // Early return to indicate completion
        }

        // Create a new user if not found
        const newUser = new UserModel({
            email,
            userName: name || 'Người dùng',
            role: '66f18ac5ab25c97ba8d69efe',
            account_type: "google",
        });

        await newUser.save();
        const accessToken = await getJsonWebToken(newUser.email, newUser.id, newUser.role);

        res.status(201).json({ // Use 201 Created for a new user
            message: "Đăng ký thành công và đăng nhập",
            data: {
                user: newUser,
                accessToken,
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});


const addReadingHistory = asyncHandler(async (req: Request, res: Response<GenericResponse<IUser | null>>): Promise<void> => {
    const { idUser, idChapter } = req.body;

    try {
        const user = await UserModel.findById(idUser);
        const chapter = await ChapterModel.findById(idChapter);

        if (!user || !chapter) {
            res.status(404).json({
                message: 'User hoặc chapter không tồn tại',
                data: null,
            });
            return; // Early return to indicate completion
        }

        const readingHistoryNew = [...user.reading_history];
        const index = readingHistoryNew.findIndex((item) => item.toString() === idChapter);

        // Update the reading history by removing the chapter if it exists and then unshifting it
        if (index !== -1) {
            readingHistoryNew.splice(index, 1); // Remove the existing chapter
        }
        readingHistoryNew.unshift(idChapter); // Add the new chapter to the front

        const updatedUser = await UserModel.findByIdAndUpdate(idUser, { reading_history: readingHistoryNew }, { new: true });

        res.status(200).json({
            message: "Thành công",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});
const blockUser = asyncHandler(async (req: Request, res: Response<GenericResponse<IUser | null>>): Promise<void> => {
    const { idUser } = req.body;

    try {
        const user = await UserModel.findById(idUser);

        if (!user) {
            res.status(400).json({
                message: 'User không tồn tại',
                data: null,
            });
            return; // Early return to indicate completion
        }
        const updateUser = await UserModel.findByIdAndUpdate(idUser, { isDeleted: !user.isDeleted }, { new: true })
        res.status(200).json({
            message: "Thành công",
            data: updateUser,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
});

const totalUser = asyncHandler(async (req: Request, res: Response<GenericResponse<number | null>>): Promise<void> => {
    const totalUser = await UserModel.find().countDocuments()
    res.status(200).json({
        message: "Thành công",
        data: totalUser,
    });
});

const changeRole = async (req: Request, res: Response) => {
    const { userId, newRoleId } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(newRoleId)) {
        const errorResponse: GenericResponse<null> = {
            message: 'Invalid userId or newRoleId.',
            data: null
        };
        return res.status(400).json(errorResponse);
    }

    try {
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user || user.isDeleted) {
            const errorResponse: GenericResponse<null> = {
                message: 'User not found or is deleted.',
                data: null
            };
            return res.status(404).json(errorResponse);
        }

        // Update user's role
        user.role = new mongoose.Types.ObjectId(newRoleId);
        await user.save();

        const successResponse: GenericResponse<IUser> = {
            message: 'Role updated successfully.',
            data: user
        };
        res.status(200).json(successResponse);
    } catch (error) {
        console.error('Error changing role:', error);
        const errorResponse: GenericResponse<null> = {
            message: 'Internal server error.',
            data: null
        };
        res.status(500).json(errorResponse);
    }
};
export default {
    getAll,
    createManyUser,
    getUserById,
    login,
    register,
    changePassword,
    loginGoogle,
    addReadingHistory,
    blockUser,
    totalUser,
    changeRole,
};
