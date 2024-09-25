import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the author
 *         name:
 *           type: string
 *           description: The name of the author
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the author is deleted
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: The date when the author was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the author was last updated
 */

export interface Author extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string;
    isDeleted: boolean;
    createAt: Date; 
    updatedAt: Date;
}

const AuthorSchema: Schema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);


const AuthorModel = mongoose.model<Author>('authors', AuthorSchema);
export default AuthorModel;
