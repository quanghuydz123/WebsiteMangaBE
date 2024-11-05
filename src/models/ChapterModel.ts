import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface Chapter extends Document {
    manga: mongoose.Types.ObjectId;
    _id: mongoose.Types.ObjectId;
    title: string;
    isDeleted: boolean;
    createAt: Date;
    updatedAt: Date;
    imageLinks: string[];
    chapterNum: number;
}

const ChapterSchema: Schema = new Schema(
    {
        manga: { type: mongoose.Schema.Types.ObjectId, ref: 'mangas', required: true },
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        imageLinks: { type: [String], required: true },
        chapterNum: {type: Number,required: true, default:1}
    },
    {
        timestamps: true,
        toJSON: { virtuals: true, versionKey: false }, // Remove __v
        toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
        id: false // Disable the virtual id field
    }
);

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
 *         chapterNum:
 *           type: integer
 *           description: The number of the chapter
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
ChapterSchema.plugin(mongoosePaginate);
const ChapterModel = mongoose.model<Chapter, PaginateModel<Chapter>>('chapters', ChapterSchema);
export default ChapterModel;