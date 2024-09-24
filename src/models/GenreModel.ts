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
        name: { type: String, required: true, unique: true }, 
        slug: { type: String, required: true, unique: true }, 
        isDeleted: { type: Boolean, default: false } 
    },
    {
        timestamps: true 
    }
);

export const GenreModel = mongoose.model<Genre>('genres', GenreSchema);