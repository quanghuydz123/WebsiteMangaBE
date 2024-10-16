import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate   from 'mongoose-paginate-v2';


export interface Author extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    isDeleted: boolean;
    createAt: Date;
    updatedAt: Date;
}



const AuthorSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
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

AuthorSchema.plugin(mongoosePaginate);
const AuthorModel = mongoose.model<Author,PaginateModel<Author>>('authors', AuthorSchema);
export default AuthorModel;
