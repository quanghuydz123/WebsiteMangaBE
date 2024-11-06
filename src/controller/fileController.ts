
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import FileModel from '../models/FileModel';
import mongoose from 'mongoose';
import { GenericResponse } from '../models/GenericResponse';

dotenv.config();

const createFile = async (req: Request, res: Response) => {
    try {
        const { name, type, parentId, data } = req.body;

        // Check if parentId is provided before querying the database
        const parentFolder = parentId ? await FileModel.findById(parentId) : null;

        // Set the path based on whether the parent folder exists
        const path = parentFolder ? `${parentFolder.path}/${name}` : name;

        const newFile = new FileModel({
            name,
            type: type || 'image', // Default to 'image' if type is not provided
            parentId: parentId || null, // Store parentId as null if not provided
            path,
            data,
        });

        await newFile.save();

        // Create a response object using GenericResponse
        const response: GenericResponse<null> = {
            message: 'File created successfully.',
            data: null,
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating file:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to create file.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

const createFolder = async (req: Request, res: Response) => {
    try {
        const { name, parentId } = req.body;

        // Check if the name is provided
        if (!name) {
            return res.status(400).json({ message: 'Folder name is required.' });
        }

        // Check if parentId is provided before querying the database
        const parentFolder = parentId ? await FileModel.findById(parentId) : null;

        // Set the path based on whether the parent folder exists
        const path = parentFolder ? `${parentFolder.path}/${name}` : name;

        const newFolder = new FileModel({
            name,
            type: 'folder',
            parentId: parentId || null, // Store parentId as null if not provided
            path,
        });

        await newFolder.save();

        // Create a response object using GenericResponse
        const response: GenericResponse<typeof newFolder> = {
            message: 'Folder created successfully.',
            data: newFolder,
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating folder:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to create folder.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

// Utility function to validate image file extensions
const isValidImageExtension = (filename: string): boolean => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase(); // Extract extension
    return validExtensions.includes(`.${extension}`);
};

const convertComputerImagesToLink = async (req: Request, res: Response) => {
    try {
        const { mangaName, chapterTitle } = req.query as { mangaName: string; chapterTitle: string };

        if (!chapterTitle || !mangaName || !req.files) {
            return res.status(400).json({ message: 'Manga name, chapter title, and images are required.', data: null });
        }

        let mangaFolder = await FileModel.findOne({ name: mangaName, type: 'folder', parentId: null });
        if (!mangaFolder) {
            mangaFolder = new FileModel({
                name: mangaName,
                type: 'folder',
                parentId: null,
                path: mangaName,
            });
            await mangaFolder.save();
        }

        let chapterFolder = await FileModel.findOne({ name: chapterTitle, type: 'folder', parentId: mangaFolder._id });
        if (!chapterFolder) {
            chapterFolder = new FileModel({
                name: chapterTitle,
                type: 'folder',
                parentId: mangaFolder._id,
                path: `${mangaFolder.path}/${chapterTitle}`,
            });
            await chapterFolder.save();
        }

        const fileIds: string[] = [];
        const invalidFiles: string[] = [];
        const images = req.files as Express.Multer.File[];

        for (const image of images) {
            if (!isValidImageExtension(image.originalname)) {
                invalidFiles.push(image.originalname);
                continue;
            }

            // Convert image buffer to base64
            const base64Data = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;

            const newFile = new FileModel({
                name: image.originalname,
                type: 'image',
                parentId: chapterFolder._id,
                path: `${chapterFolder.path}/${image.originalname}`,
                data: base64Data,  // Save the base64 string in the database
            });

            await newFile.save();
            fileIds.push(`${process.env.SERVER_API}/files/image?id=${newFile._id}`);
        }

        const response = {
            message: invalidFiles.length > 0
                ? 'Files created successfully, but some files have invalid extensions.'
                : 'Files created successfully.',
            data: { fileIds, invalidFiles: invalidFiles.length > 0 ? invalidFiles : undefined },
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating files:', error);
        res.status(500).json({ message: 'Unable to create files.' + error, data: null });
    }
};


const getFiles = async (req: Request, res: Response) => {
    try {
        const { parentId, page = 1, limit = 10 } = req.query;

        const query = {
            parentId: parentId ? new mongoose.Types.ObjectId(parentId as string) : null, // Ensure parentId is an ObjectId if provided
        };

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: { createdAt: -1 },
            select: "name type isDeleted data _id"
        };

        const files = await FileModel.paginate(query, options);

        // Create a response object using GenericResponse
        const response: GenericResponse<typeof files> = {
            message: 'Files retrieved successfully.',
            data: files,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching files:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to fetch files.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

const getFilesByName = async (req: Request, res: Response) => {
    try {
        const { name, parentId, page = 1, limit = 10 } = req.query;

        // Trim the name and check if it's empty
        const trimmedName = name ? (name as string).trim() : '';

        // If trimmedName is empty, return a 400 Bad Request status
        if (!trimmedName) {
            const errorResponse: GenericResponse<null> = {
                message: 'Name cannot be empty.',
                data: null,
            };
            return res.status(400).json(errorResponse);
        }

        // Construct the query with a regex for the name and the parentId
        const query: any = {
            parentId: parentId ? new mongoose.Types.ObjectId(parentId as string) : null, // Ensure parentId is an ObjectId
            name: { $regex: new RegExp(trimmedName, 'i') }, // Use regex for case-insensitive matching
        };

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: { createdAt: -1 },
            select: "name type isDeleted data _id",
        };

        // Fetch the files based on the constructed query and options
        const files = await FileModel.paginate(query, options);

        // Create a success response object using GenericResponse
        const response: GenericResponse<typeof files> = {
            message: 'Files retrieved successfully.',
            data: files,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching files by name:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to fetch files.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

const moveFile = async (req: Request, res: Response) => {
    try {
        const { fileId, newParentId } = req.body;

        // Find the file to move
        const file = await FileModel.findById(fileId);
        if (!file) {
            const errorResponse: GenericResponse<null> = {
                message: 'File not found.',
                data: null,
            };
            return res.status(404).json(errorResponse);
        }

        // Find the new parent folder
        const newParentFolder = await FileModel.findById(newParentId);
        const newPath = newParentFolder ? `${newParentFolder.path}/${file.name}` : file.name;

        // Update the file's parentId and path
        file.parentId = newParentId || null;
        file.path = newPath;

        // Save the updated file
        const updatedFile = await file.save();

        // Create a success response object using GenericResponse
        const response: GenericResponse<typeof updatedFile> = {
            message: 'File moved successfully.',
            data: updatedFile,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error moving file:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to move file.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};
const deleteFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Validate the ID
        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            const errorResponse: GenericResponse<null> = {
                message: 'Invalid file ID.',
                data: null,
            };
            return res.status(400).json(errorResponse);
        }

        // Find the file by ID
        const file = await FileModel.findById(id);
        if (!file) {
            const errorResponse: GenericResponse<null> = {
                message: 'File not found.',
                data: null,
            };
            return res.status(404).json(errorResponse);
        }

        // Mark the current file as deleted
        file.isDeleted = true;
        await file.save();

        // Recursively mark all child files as deleted
        await markChildFilesAsDeleted(file._id);

        // Create a success response object using GenericResponse
        const response: GenericResponse<null> = {
            message: 'File and its children deleted successfully.',
            data: null,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting file:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to delete file.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

const restoreFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Validate the ID
        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            const errorResponse: GenericResponse<null> = {
                message: 'Invalid file ID.',
                data: null,
            };
            return res.status(400).json(errorResponse);
        }

        // Find the file by ID
        const file = await FileModel.findById(id);
        if (!file) {
            const errorResponse: GenericResponse<null> = {
                message: 'File not found.',
                data: null,
            };
            return res.status(404).json(errorResponse);
        }

        // Restore the current file
        file.isDeleted = false;
        await file.save();

        // Recursively restore all child files
        await restoreChildFiles(file._id);

        // Create a success response object using GenericResponse
        const response: GenericResponse<null> = {
            message: 'File and its children restored successfully.',
            data: null,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error restoring file:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to restore file.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

// Function to recursively restore child files
const restoreChildFiles = async (parentId: mongoose.Types.ObjectId) => {
    const childFiles = await FileModel.find({ parentId, isDeleted: true });

    // Restore each child file
    for (const child of childFiles) {
        child.isDeleted = false;
        await child.save();

        // Recursively restore its children
        await restoreChildFiles(child._id);
    }
};

const getDeletedFiles = async (req: Request, res: Response) => {
    try {
        const { parentId, page = 1, limit = 10 } = req.query;

        const query = {
            parentId: parentId ? parentId : null,
            isDeleted: true, // Only fetch deleted files
        };

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: { createdAt: -1 },
            select: "name type _id createdAt", // Specify the fields you want to return
        };

        const files = await FileModel.paginate(query, options);

        // Create a success response object using GenericResponse
        const response: GenericResponse<typeof files> = {
            message: 'Deleted files fetched successfully.',
            data: files,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching deleted files:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to fetch deleted files.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

const createImageFromLink = async (req: Request, res: Response) => {
    try {
        const { link, name, parentId } = req.body;

        // Fetch the image from the URL using fetch
        const response = await fetch(link);
        if (!response.ok) {
            return res.status(400).json({ message: 'Failed to fetch image from the provided link.' });
        }

        const buffer = await response.arrayBuffer();
        // Convert image to base64
        const base64Image = Buffer.from(buffer).toString('base64');
        const mimeType = response.headers.get('content-type');
        const base64Data = `data:${mimeType};base64,${base64Image}`;

        // Get parent folder info and build the path
        const parentFolder = await FileModel.findById(parentId);
        const path = parentFolder ? `${parentFolder.path}/${name}` : name;

        // Create the image entry
        const newImage = new FileModel({
            name,
            type: 'image',
            parentId: parentId || null,
            path,
            data: base64Data
        });

        await newImage.save();

        // Create a success response object using GenericResponse
        const responseData: GenericResponse<typeof newImage> = {
            message: 'Image created successfully from link.',
            data: newImage,
        };

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error creating image from link:', error); // Log the error for debugging

        // Create an error response object using GenericResponse
        const errorResponse: GenericResponse<null> = {
            message: 'Unable to create image from link.',
            data: null,
        };

        res.status(500).json(errorResponse);
    }
};

const getImageForHTMLImgTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Find the image by ID
        const image = await FileModel.findById(id);
        if (!image || image.isDeleted || image.type !== 'image') {
            return res.status(404).json({ message: 'Image not found', data: null });
        }
        if (!image.data) {
            return res.status(404).json({ message: 'Image data not found', data: null });
        }

        // Determine the content type from the base64 string
        let contentType: string;

        // Check if the base64 data contains the appropriate prefix
        if (image.data.startsWith('data:image/jpeg') || image.data.startsWith('data:image/jpg')) {
            contentType = 'image/jpeg';
        } else if (image.data.startsWith('data:image/png')) {
            contentType = 'image/png';
        } else if (image.data.startsWith('data:image/webp')) {
            contentType = 'image/webp';
        } else {
            return res.status(500).json({ message: 'Unsupported image format', data: null });
        }

        // Remove the prefix and convert to buffer
        const base64Data = image.data.split(',')[1]; // Split to get only the base64 part
        const imgBuffer = Buffer.from(base64Data, 'base64');

        // Set the content type and caching headers for 1 hour
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.set('Expires', new Date(Date.now() + 3600 * 1000).toUTCString()); // Set expiration date to 1 hour later

        // Send the image buffer
        res.send(imgBuffer);
    } catch (error) {
        console.error('Error retrieving image:', error); // Log the error for debugging
        res.status(500).json({ message: 'Unable to retrieve image', data: null });
    }
};


const getImagesFromFolderPaginate = async (req: Request, res: Response) => {
    try {
        const { folder, page = 1, limit = 10 } = req.query;

        // Validate inputs
        const folderId = folder as string;
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);

        // Construct the query to find images in the given folder (non-deleted)
        const query = { parentId: folderId, isDeleted: false, type: 'image' };

        // Paginate the results
        const options = {
            page: pageNumber,
            limit: limitNumber,
            sort: { name: 1, createdAt: -1 }, // Sort by latest images
        };

        // Fetch paginated results
        const result = await FileModel.paginate(query, options);

        // Return the paginated results
        res.status(200).json({
            message: 'Images retrieved successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error retrieving images:', error); // Log the error for debugging
        res.status(500).json({ message: 'Unable to retrieve images', data: null });
    }
};

// Function to recursively mark child files as deleted
const markChildFilesAsDeleted = async (parentId: mongoose.Types.ObjectId) => {
    const childFiles = await FileModel.find({ parentId, isDeleted: false });

    // Mark each child file as deleted
    for (const child of childFiles) {
        child.isDeleted = true;
        await child.save();

        // Recursively delete its children
        await markChildFilesAsDeleted(child._id);
    }
};

const changeFolderName = async (oldName: string, newName: string): Promise<boolean> => {
    try {
        // Check if newName is provided
        if (!newName) {
            console.error('New folder name is required.');
            return false;
        }

        // Find the folder by the old name
        const folder = await FileModel.findOne({ name: oldName, type: 'folder' });

        // Check if the folder exists
        if (!folder) {
            console.error('Folder not found.');
            return false;
        }

        // Store the old path and update the folder name
        const oldPath = folder.path;
        folder.name = newName;

        // Update the path of the folder using oldName
        const newPath = oldPath.replace(oldName, newName); // Replace the old name with the new name
        folder.path = newPath;

        // Save the updated folder
        await folder.save();

        // Update the paths of all child files and folders
        const children = await FileModel.find({ parentId: folder._id });
        for (const child of children) {
            const oldChildPath = child.path;
            const newChildPath = oldChildPath.replace(oldName, newName); // Update the path to reflect the new folder name
            child.path = newChildPath;
            await child.save(); // Save the updated child path
        }

        // Return true if the operation was successful
        return true;
    } catch (error) {
        console.error('Error changing folder name:', error);
        return false; // Return false if there was an error
    }
};


export default {
    createFile,
    createFolder,
    getFiles,
    moveFile,
    deleteFile,
    restoreFile,
    getDeletedFiles,
    createImageFromLink,
    getImageForHTMLImgTag,
    getImagesFromFolderPaginate,
    getFilesByName,
    convertComputerImagesToLink,
    changeFolderName
}