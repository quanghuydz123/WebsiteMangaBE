import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the comment
 *         user:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user who made the comment
 *         text:
 *           type: string
 *           description: The text of the comment
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the comment is deleted
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: The date when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the comment was last updated
 *         manga:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the associated manga
 */

export interface Comment extends Document {
    _id: mongoose.Types.ObjectId; 
    user: mongoose.Types.ObjectId; 
    text: string;
    isDeleted: boolean;
    createAt: Date; 
    updatedAt: Date; 
    manga: mongoose.Types.ObjectId; 
}

const CommentSchema: Schema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, 
        text: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        manga: { type: mongoose.Schema.Types.ObjectId, ref: 'mangas', required: true } 
    },
    {
        timestamps: true, 
    }
);

const CommentModel = mongoose.model<Comment>('comments', CommentSchema);
export default CommentModel;