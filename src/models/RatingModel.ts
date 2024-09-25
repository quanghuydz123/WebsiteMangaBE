import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the rating
 *         star:
 *           type: integer
 *           description: The star rating given by the user (e.g., 1 to 5)
 *         user:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user who gave the rating
 *         manga:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the manga being rated
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the rating was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the rating was last updated
 */

export interface Rating extends Document {
    _id: mongoose.Types.ObjectId; 
    star: number; 
    user: mongoose.Types.ObjectId; 
    manga: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const RatingSchema: Schema = new mongoose.Schema(
    {
        star: { type: Number, required: true, min: 0, max: 5 }, 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        },
        manga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mangas', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const RatingModel = mongoose.model<Rating>('ratings', RatingSchema);
export default RatingModel;
