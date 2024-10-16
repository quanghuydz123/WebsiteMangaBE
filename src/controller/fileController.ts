
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import FileModel, { IFileModel } from '../models/FileModel';
import mongoose from 'mongoose';

dotenv.config();

// const selfQueryImage = async (req: Request, res: Response) => {
//     try {
//         const { page = 1, limit = 10, filter = {}, options = {} } = req.body;

//         // Pagination options
//         const paginationOptions = {
//             page: Number(page),
//             limit: Number(limit),
//             select: options.select
//                 ? options.select.join(' ')
//                 : 'filePath breadcrumb fileName mimeType createdAt updatedAt', // Include fileName and breadcrumb in selection
//             sort: options.sort || { createdAt: -1 }, // Sort by `createdAt` descending by default
//             lean: options.lean || false, // Return plain JS objects if `lean` is true
//             leanWithId: options.leanWithId || true // Include `_id` as a string if lean
//         };

//         // Construct query filter based on provided filter values
//         const queryFilter = {
//             ...(filter.filePath ? { filePath: { $regex: filter.filePath, $options: 'i' } } : {}),
//             ...(filter.breadcrumb ? { breadcrumb: { $regex: filter.breadcrumb, $options: 'i' } } : {}), // Filter by breadcrumb
//             ...(filter.isDeleted !== undefined ? { isDeleted: filter.isDeleted } : {})
//         };

//         // Paginate the query
//         const result = await ImageModel.paginate(queryFilter, paginationOptions);

//         return res.status(200).json(result);
//     } catch (error) {
//         return res.status(500).json({ message: 'Error fetching images', error });
//     }
// };

const createFile = async (req: Request, res: Response) => {
  try {
    const { name, type, parentId, data } = req.body;

    // Check if parentId is provided before querying the database
    const parentFolder = parentId ? await FileModel.findById(parentId) : null;

    // Set the path based on whether the parent folder exists
    const path = parentFolder ? `${parentFolder.path}/${name}` : name;

    const newFile = new FileModel({
      name,
      type: 'image',
      parentId: parentId || null, // Store parentId as null if not provided
      path,
      data: data,
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    console.error('Error creating file:', error); // Log the error for debugging
    res.status(500).json({ error: 'Unable to create file: ' + error });
  }
};


const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;

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
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating folder:', error); // Log the error for debugging
    res.status(500).json({ error: 'Unable to create folder: ' + error });
  }
};


const getFiles = async (req: Request, res: Response) => {
  try {
    const { parentId, page = 1, limit = 10 } = req.query;

    const query = {
      parentId: parentId || null,
    };

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
      select: "name type isDeleted data _id"
    };

    const files = await FileModel.paginate(query, options);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch files' });
  }
};
const getFilesByName = async (req: Request, res: Response) => {
  try {
    const { name, parentId, page = 1, limit = 10 } = req.query;

    // Trim the name and check if it's empty
    const trimmedName = name ? (name as string).trim() : '';

    // If trimmedName is empty, return a 400 Bad Request status
    if (!trimmedName) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    // Construct the query with a regex for the name and the parentId
    const query: any = {
      parentId: parentId || null,
    };

    // Use a regex to find files with a similar name (case-insensitive)
    query.name = { $regex: new RegExp(trimmedName, 'i') };

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
      select: "name type isDeleted data _id",
    };

    // Fetch the files based on the constructed query and options
    const files = await FileModel.paginate(query, options);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch files' });
  }
};



const moveFile = async (req: Request, res: Response) => {
  try {
    const { fileId, newParentId } = req.body;

    const file = await FileModel.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const newParentFolder = await FileModel.findById(newParentId);
    const newPath = newParentFolder ? `${newParentFolder.path}/${file.name}` : file.name;

    file.parentId = newParentId || null;
    file.path = newPath;

    await file.save();
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Unable to move file' });
  }
};

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    // Find the file by ID
    const file = await FileModel.findById(id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Mark the current file as deleted
    file.isDeleted = true;
    await file.save();

    // Recursively mark all child files as deleted
    await markChildFilesAsDeleted(file._id);

    res.json({ message: 'File and its children deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete file' });
  }
};

const restoreFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const file = await FileModel.findById(id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Restore the current file
    file.isDeleted = false;
    await file.save();

    // Recursively restore all child files
    await restoreChildFiles(file._id);

    res.json({ message: 'File and its children restored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to restore file' });
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
      parentId: parentId || null,
      isDeleted: true,
    };

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
    };

    const files = await FileModel.paginate(query, options);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch deleted files' });
  }
};

const createImageFromLink = async (req: Request, res: Response) => {
  try {
    const { link, name, parentId } = req.body;

    // Fetch the image from the URL using fetch
    const response = await fetch(link);
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
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create image from link' });
  }
};

const getImageForHTMLImgTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    // Find the image by ID
    const image = await FileModel.findById(id);
    if (!image || image.isDeleted || image.type !== 'image') {
      return res.status(404).send('Image not found');
    }
    if (!image.data) {
      return res.status(404).send('Image data not found');
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
      return res.status(500).send('Unsupported image format:\n' + image.data);
    }

    // Remove the prefix and convert to buffer
    const base64Data = image.data.split(',')[1]; // Split to get only the base64 part
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // Set the content type and send the image buffer
    res.set('Content-Type', contentType);
    res.send(imgBuffer);
  } catch (error) {
    res.status(500).send('Unable to retrieve image');
  }
};



const getImagesFromFolderPaginate = async (req: Request, res: Response) => {
  try {
    const { folder, page = 1, limit = 10 } = req.query;

    // Find images in the given folder (non-deleted)
    const query = { folder, isDeleted: false, type: 'image' };

    // Paginate the results
    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { name: 1, createdAt: -1 }, // Sort by latest images
    };

    const result = await FileModel.paginate(query, options);



    // Return the paginated results
    res.status(200).json(result)

  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve images' });
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
  getFilesByName
}