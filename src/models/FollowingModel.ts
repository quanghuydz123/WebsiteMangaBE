import mongoose, { Schema, Document } from 'mongoose';



export interface Following extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    manga: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const FollowingSchema: Schema = new mongoose.Schema(
    {
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
 *     Following:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the following record
 *         user:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user who is following
 *         manga:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the manga being followed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the following record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the following record was last updated
 */
const FollowingModel = mongoose.model<Following>('followings', FollowingSchema);
export default FollowingModel;
