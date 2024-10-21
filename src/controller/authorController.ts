import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import AuthorModel, { Author } from '../models/AuthorModel';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { GenericResponse } from '../models/GenericResponse';

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
    const limit: number = parseInt(req.query.limit as string) || 10; // Default to 10
    const skip: number = (page - 1) * limit; // Calculate how many items to skip

    try {
        const totalAuthor = await AuthorModel.countDocuments(); // Get the total number of authors
        const authorList = await AuthorModel.find()
            .skip(skip)
            .limit(limit); // Get the paginated results

        const response: GenericResponse<{
            page: number;
            totalAuthor: number;
            totalPages: number;
            authors: typeof authorList;
        }> = {
            message: 'Authors retrieved successfully',
            data: {
                page,
                totalAuthor,
                totalPages: Math.ceil(totalAuthor / limit),
                authors: authorList,
            }
        };

        res.status(200).json(response);
    } catch (error) {
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving authors',
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

const selfQueryAuthor = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, filter = {}, options = {} } = req.body;

        // Construct pagination options
        const paginationOptions = {
            page: Number(page),
            limit: Number(limit),
            select: options.select ? options.select.join(' ') : 'name createAt updatedAt',  // Join if it's an array
            sort: options.sort || { createAt: -1 },  // Sort by `createAt` descending by default
            lean: options.lean || false,             // Whether to return plain JS objects
            leanWithId: options.leanWithId || true   // Include `_id` as string if lean
        };

        // Filter can contain various criteria, e.g., `name` and `isDeleted`
        const queryFilter = {
            ...(filter.name ? { name: { $regex: filter.name, $options: 'i' } } : {}),
            ...(filter.isDeleted !== undefined ? { isDeleted: filter.isDeleted } : {})
        };

        // Paginate the query with filters and options
        const result = await AuthorModel.paginate(queryFilter, paginationOptions);

        // Use GenericResponse for success
        const response: GenericResponse<typeof result> = {
            message: 'Authors retrieved successfully',
            data: result
        };

        // Send the paginated results back to the client
        return res.status(200).json(response);
    } catch (error) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving authors',
            data: null
        };
        return res.status(500).json(errorResponse);
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

        // Use GenericResponse for success
        const response: GenericResponse<{
            page: number;
            totalAuthors: number;
            totalPages: number;
            authors: typeof authorList;
        }> = {
            message: 'Authors retrieved successfully',
            data: {
                page: pageNumber,
                totalAuthors,
                totalPages: Math.ceil(totalAuthors / limitNumber),
                authors: authorList,
            }
        };

        res.status(200).json(response);
    } catch (error) {
        // Use GenericResponse for error
        const errorResponse: GenericResponse<null> = {
            message: 'Error retrieving authors',
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

const createAuthor = async (req: Request, res: Response) => {
    const { name, isReturnNewData } = req.body;

    if (!name) {
        const errorResponse: GenericResponse<null> = {
            message: "Name is required.",
            data: null
        };
        return res.status(400).json(errorResponse);
    }

    const author = new AuthorModel({ name });

    try {
        const newAuthor = await author.save();
        console.log(newAuthor);

        // Set responseData based on isReturnNewData
        const responseData = isReturnNewData ? newAuthor : null; // Return author if requested, otherwise null

        const response: GenericResponse<typeof responseData> = {
            message: "Author created successfully.",
            data: responseData // data will be null if isReturnNewData is false
        };

        res.status(201).json(response);
    } catch (error: any) {
        const errorResponse: GenericResponse<null> = {
            message: "Server error: " + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
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
            const errorResponse: GenericResponse<null> = {
                message: "Author not found.",
                data: null
            };
            return res.status(404).json(errorResponse);
        }

        const responseData = isReturnNewData ? updatedAuthor : null;

        const response: GenericResponse<typeof responseData> = {
            message: "Author updated successfully.",
            data: responseData // data will be null if isReturnNewData is false
        };

        res.status(200).json(response);
    } catch (error: any) {
        const errorResponse: GenericResponse<null> = {
            message: "Server error: " + error.message,
            data: null
        };
        res.status(500).json(errorResponse);
    }
};

export default {
    createManyAuthor,
    getPaginatedAuthor,
    getAdvancedPaginatedAuthor,
    createAuthor,
    updateAuthor,
    selfQueryAuthor
};
