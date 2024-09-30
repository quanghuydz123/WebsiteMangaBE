import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         manga:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the associated manga
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the chapter
 *         title:
 *           type: string
 *           description: The title of the chapter
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the chapter is deleted
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: The date when the chapter was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the chapter was last updated
 *         imageLink:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of image links for the chapter
 */

export interface Chapter extends Document {
    manga: mongoose.Types.ObjectId;
    _id: mongoose.Types.ObjectId;
    title: string;
    isDeleted: boolean;
    createAt: Date;
    updatedAt: Date;
    imageLink: string[];
}

const ChapterSchema: Schema = new Schema(
    {
        manga: { type: mongoose.Schema.Types.ObjectId, ref: 'mangas', required: true },
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        imageLinks: { type: [String], required: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true, versionKey: false }, // Remove __v
        toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
        id: false // Disable the virtual id field
    }
);
ChapterSchema.plugin(mongoosePaginate);
const ChapterModel = mongoose.model<Chapter, PaginateModel<Chapter>>('chapters', ChapterSchema);
export default ChapterModel;