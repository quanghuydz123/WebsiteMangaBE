import mongoose, { Schema, Document } from 'mongoose';



export interface Genre extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GenreSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }
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
 *     Genre:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the genre
 *         name:
 *           type: string
 *           description: The name of the genre
 *         slug:
 *           type: string
 *           description: A URL-friendly version of the genre name
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the genre is deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the genre was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the genre was last updated
 */
const GenreModel = mongoose.model<Genre>('genres', GenreSchema);
export default GenreModel;