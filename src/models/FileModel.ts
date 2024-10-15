import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the image
 *         filePath:
 *           type: string
 *           description: The full path of the image but id style
 *         breadcrumb:
 *           type: string
 *           description: The full path of the image but human readable
*         fileName:
 *           type: string
 *           description: file name
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the image is deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the image was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the image was last updated
 *         data:
 *           type: string
 *           description: The base64-encoded image data
 *         mimeType:
 *           type: string
 *           description: type of image png or jpg or webp
 */

export interface IFileModel extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;        // Image or Folder name
  type: 'folder' | 'image'; // Type: folder or image
  parentId: string;    // Parent folder ID (null if root)
  path: string;        // Path or breadcrumb for folder/image
  data?: string;       // Base64-encoded image data (only for images)
  createdAt: Date;     // Creation date
  isDeleted: boolean;  // Soft delete flag
}

const FileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'image'], required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'File', default: null }, // Reference to parent folder
    path: { type: String, required: true },
    data: { type: String },  // Only for images
    isDeleted: { type: Boolean, default: false },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
    id: false // Disable the virtual id field
  }
);


FileSchema.plugin(mongoosePaginate);
const FileModel = mongoose.model<IFileModel, PaginateModel<IFileModel>>('files', FileSchema);

export default FileModel;
