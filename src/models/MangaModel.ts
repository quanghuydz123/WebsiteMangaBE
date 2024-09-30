import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

/**
 * @swagger
 * components:
 *   schemas:
 *     Manga:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the manga
 *         name:
 *           type: string
 *           description: The name of the manga
 *         status:
 *           type: integer
 *           description: The publication status of the manga
 *         imageUrl:
 *           type: string
 *           description: The URL of the manga's cover image
 *         summary:
 *           type: string
 *           description: A brief summary of the manga's story
 *         author:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An array of unique identifiers for the authors of the manga
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the manga is deleted
 *         publisher:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the publisher of the manga
 *         views:
 *           type: integer
 *           description: The total number of views the manga has received
 *         publish_date:
 *           type: integer
 *           description: The publication date of the manga in timestamp format
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An array of unique identifiers for the genres associated with the manga
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the manga was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the manga was last updated
 */

export interface Manga extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string; 
    status: number; 
    imageUrl: string; 
    summary: string; 
    author: mongoose.Types.ObjectId[]; 
    isDeleted: boolean; 
    publisher: mongoose.Types.ObjectId; 
    views: number; 
    publish_date: number; 
    genres: mongoose.Types.ObjectId[]; 
    createdAt: Date; 
    updatedAt: Date; 
}

const MangaSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true }, 
        status: { type: Number, required: true }, 
        imageUrl: { type: String, required: true }, 
        summary: { type: String, required: true }, 
        author: { 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'authors', 
            required: true 
        },
        isDeleted: { type: Boolean, default: false }, 
        publisher: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'publishers', 
            required: true 
        },
        views: { type: Number, default: 0 }, 
        publish_date: { type: Date, required: true }, 
        genres: { 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'genres', 
            required: true 
        }
    },
    {
        timestamps: true, 
    }
);

MangaSchema.plugin(paginate);
// const MangaModel = mongoose.model<Manga>('mangas', MangaSchema);
const MangaModel: PaginateModel<Manga> = mongoose.model<Manga, PaginateModel<Manga>>('mangas', MangaSchema);

export default MangaModel;
