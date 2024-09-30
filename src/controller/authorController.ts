import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import AuthorModel, { Author } from '../models/AuthorModel';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

const createManyAuthor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { tb_Author } = req.body;

    await Promise.all(tb_Author.map(async (author: { _id: string }) => {
        await AuthorModel.create({
            ...author,
            _id: new mongoose.Types.ObjectId(author._id),
        });
    }));

    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});


const getPaginatedAuthor = async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit: number = parseInt(req.query.limit as string) || 10; // Default to page 1
    const skip: number = (page - 1) * limit; // Calculate how many items to skip

    try {
        const totalAuthor = await AuthorModel.countDocuments(); // Get the total number of Author
        const authorList = await AuthorModel.find()
            .skip(skip)
            .limit(limit); // Get the paginated results

        res.status(200).json({
            page,
            totalAuthor,
            totalPages: Math.ceil(totalAuthor / limit),
            Author: authorList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Author', error });
    }
};

const getAdvancedPaginatedAuthor = async (req: Request, res: Response) => {
    const { page, limit, filter } = req.query;

    const pageNumber: number = parseInt(page as string, 10) || 1; // Default to page 1
    const limitNumber: number = parseInt(limit as string, 10) || 10; // Default to limit 10
    const skip: number = (pageNumber - 1) * limitNumber; // Calculate how many items to skip

    try {
        const totalAuthors = await AuthorModel.countDocuments(); // Get the total number of authors

        // Build the projection object
        const projection: any = {};
        if (filter) {
            // Split the filter string and include only those fields
            const filterArray = (filter as string).split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1; // Include the field in the response
            });
        }

        // Get the paginated results
        const authorList = await AuthorModel.find()
            .select(projection)
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            page: pageNumber,
            totalAuthors,
            totalPages: Math.ceil(totalAuthors / limitNumber),
            authors: authorList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving authors', error });
    }
};

const createAuthor = async (req: Request, res: Response) => {
    const { name, isReturnNewData } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required." });
    }

    const author = new AuthorModel({ name });

    try {
        const newAuthor: Author = await author.save();
        console.log(newAuthor);

        // Set responseData based on isReturnNewData
        const responseData = isReturnNewData ? author : null; // Return author if requested, otherwise null

        res.status(201).json({
            success: true,
            message: "Author created successfully.",
            data: responseData // data will be null if isReturnNewData is false
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error." + error.message });
    }
};

const updateAuthor = async (req: Request, res: Response) => {
   
    const { id, name, isDeleted, isReturnNewData } = req.body;

    try {
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(
            id,
            { ...(name && { name }), ...(isDeleted !== undefined && { isDeleted }) },
            { new: isReturnNewData } // Return updated document if requested
        );

        if (!updatedAuthor) {
            return res.status(404).json({ success: false, message: "Author not found." });
        }

        res.status(200).json({
            success: true,
            message: "Author updated successfully.",
            data: isReturnNewData ? updatedAuthor : null
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};

export default {
    createManyAuthor,
    getPaginatedAuthor,
    getAdvancedPaginatedAuthor,
    createAuthor,
    updateAuthor
};
