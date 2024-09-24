import mongoose, { Schema, Document } from 'mongoose';

export interface Chapter extends Document {
    idManga: mongoose.Types.ObjectId; 
    _id: mongoose.Types.ObjectId; 
    title: string;
    isDeleted: boolean;
    createAt: Date; 
    updatedAt: Date;
    imageLink: string[];
}

const ChapterSchema: Schema = new Schema(
    {
        idManga: { type: mongoose.Schema.Types.ObjectId, ref: 'manga', required: true }, 
        _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        imageLink: { type: [String], required: true },
    },
    {
        timestamps: true, 
    }
);

export const ChapterModel = mongoose.model<Chapter>('chapters', ChapterSchema);