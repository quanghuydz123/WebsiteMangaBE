import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user
 *         userName:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password for the user's account (optional)
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the user's account is deleted
 *         account_type:
 *           type: string
 *           description: The type of account (e.g., basic, google)
 *         reading_history:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An array of unique identifiers for the manga the user has read
 *         role:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user's role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was last updated
 */

export interface User extends Document {
    _id: mongoose.Types.ObjectId; 
    userName: string; 
    email: string; 
    password?: string; 
    isDeleted: boolean; 
    account_type: string; 
    reading_history: mongoose.Types.ObjectId[]; 
    role: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const UserSchema: Schema = new mongoose.Schema(
    {
        userName: { type: String }, 
        email: { type: String, required: true }, 
        password: { type: String }, 
        isDeleted: { type: Boolean, default: false }, 
        account_type: { type: String, required: true }, 
        reading_history: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chapters' 
        }],
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const UserModel = mongoose.model<User>('User', UserSchema);
export default UserModel;