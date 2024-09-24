import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { RoleModel } from '../models/RoleModel';
import mongoose from 'mongoose';

dotenv.config();

// Function to validate input
const validateInput = (name: string, _id: string) => {
    if (!name || !_id) {
        return { valid: false, message: "Name and ID are required" };
    }
    return { valid: true };
};

const createRoleID = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { _id, name } = req.body;

    // Validate input
    const validation = validateInput(name, _id);
    if (!validation.valid) {
        res.status(400).json({
            status: 400,
            message: validation.message,
        });
        return; // Explicitly return to avoid further execution
    }

    try {
        const role = await RoleModel.create({
            _id: new mongoose.Types.ObjectId(_id),
            name,
        });
        res.status(201).json({
            status: 201,
            message: "Role created successfully",
            role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: (error as Error).message,
        });
        next(error); // Call next() to pass the error to the error handler
    }
});


export default { createRoleID };
