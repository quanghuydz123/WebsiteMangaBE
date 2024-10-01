"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const AuthorModel_1 = __importDefault(require("../models/AuthorModel"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const createManyAuthor = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { tb_Author } = req.body;
    await Promise.all(tb_Author.map(async (author) => {
        await AuthorModel_1.default.create({
            ...author,
            _id: new mongoose_1.default.Types.ObjectId(author._id),
        });
    }));
    res.status(200).json({
        status: 200,
        message: "Thành công",
    });
});
const getPaginatedAuthor = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to page 1
    const skip = (page - 1) * limit; // Calculate how many items to skip
    try {
        const totalAuthor = await AuthorModel_1.default.countDocuments(); // Get the total number of Author
        const authorList = await AuthorModel_1.default.find()
            .skip(skip)
            .limit(limit); // Get the paginated results
        res.status(200).json({
            page,
            totalAuthor,
            totalPages: Math.ceil(totalAuthor / limit),
            Author: authorList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving Author', error });
    }
};
const selfQueryAuthor = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = {}, options = {} } = req.body;
        // Construct pagination options
        const paginationOptions = {
            page: Number(page),
            limit: Number(limit),
            select: options.select ? options.select.join(' ') : 'name createAt updatedAt', // Join if it's an array
            sort: options.sort || { createAt: -1 }, // Sort by `createAt` descending by default
            lean: options.lean || false, // Whether to return plain JS objects
            leanWithId: options.leanWithId || true // Include `_id` as string if lean
        };
        // Filter can contain various criteria, e.g., `name` and `isDeleted`
        const queryFilter = {
            ...(filter.name ? { name: { $regex: filter.name, $options: 'i' } } : {}),
            ...(filter.isDeleted !== undefined ? { isDeleted: filter.isDeleted } : {})
        };
        // Paginate the query with filters and options
        const result = await AuthorModel_1.default.paginate(queryFilter, paginationOptions);
        // Send the paginated results back to the client
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
const getAdvancedPaginatedAuthor = async (req, res) => {
    const { page, limit, filter } = req.query;
    const pageNumber = parseInt(page, 10) || 1; // Default to page 1
    const limitNumber = parseInt(limit, 10) || 10; // Default to limit 10
    const skip = (pageNumber - 1) * limitNumber; // Calculate how many items to skip
    try {
        const totalAuthors = await AuthorModel_1.default.countDocuments(); // Get the total number of authors
        // Build the projection object
        const projection = {};
        if (filter) {
            // Split the filter string and include only those fields
            const filterArray = filter.split(',');
            filterArray.forEach(attr => {
                projection[attr] = 1; // Include the field in the response
            });
        }
        // Get the paginated results
        const authorList = await AuthorModel_1.default.find()
            .select(projection)
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            page: pageNumber,
            totalAuthors,
            totalPages: Math.ceil(totalAuthors / limitNumber),
            authors: authorList,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving authors', error });
    }
};
const createAuthor = async (req, res) => {
    const { name, isReturnNewData } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required." });
    }
    const author = new AuthorModel_1.default({ name });
    try {
        const newAuthor = await author.save();
        console.log(newAuthor);
        // Set responseData based on isReturnNewData
        const responseData = isReturnNewData ? author : null; // Return author if requested, otherwise null
        res.status(201).json({
            success: true,
            message: "Author created successfully.",
            data: responseData // data will be null if isReturnNewData is false
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error." + error.message });
    }
};
const updateAuthor = async (req, res) => {
    const { id, name, isDeleted, isReturnNewData } = req.body;
    try {
        const updatedAuthor = await AuthorModel_1.default.findByIdAndUpdate(id, { ...(name && { name }), ...(isDeleted !== undefined && { isDeleted }) }, { new: isReturnNewData } // Return updated document if requested
        );
        if (!updatedAuthor) {
            return res.status(404).json({ success: false, message: "Author not found." });
        }
        res.status(200).json({
            success: true,
            message: "Author updated successfully.",
            data: isReturnNewData ? updatedAuthor : null
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};
exports.default = {
    createManyAuthor,
    getPaginatedAuthor,
    getAdvancedPaginatedAuthor,
    createAuthor,
    updateAuthor,
    selfQueryAuthor
};
