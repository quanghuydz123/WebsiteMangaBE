import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    _id: mongoose.Types.ObjectId; 
    userName: string; 
    email: string; 
    password?: string; 
    isDeleted: boolean; 
    account_type: string; 
    reading_history: mongoose.Types.ObjectId[]; 
    idRole: mongoose.Types.ObjectId; 
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
        idRole: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

export const UserModel = mongoose.model<User>('User', UserSchema);