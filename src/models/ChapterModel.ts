import mongoose, { Schema, Document } from 'mongoose';

export interface Chapter extends Document {
    manga: mongoose.Types.ObjectId; 
    _id: mongoose.Types.ObjectId; 
    title: string;
    isDeleted: boolean;
    createAt: Date; 
    updatedAt: Date;
    imageLink: string[];
}

const ChapterSchema: Schema = new Schema(
    {
        manga: { type: mongoose.Schema.Types.ObjectId, ref: 'mangas', required: true }, 
        _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        imageLink: { type: [String], required: true },
    },
    {
        timestamps: true, 
    }
);

const ChapterModel = mongoose.model<Chapter>('chapters', ChapterSchema);
export default ChapterModel;