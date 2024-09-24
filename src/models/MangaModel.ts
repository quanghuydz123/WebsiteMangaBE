import mongoose, { Schema, Document } from 'mongoose';

export interface Manga extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string; 
    status: number; 
    imageUrl: string; 
    summary: string; 
    author: mongoose.Types.ObjectId[]; 
    isDeleted: boolean; 
    publisher: mongoose.Types.ObjectId; 
    views: number; 
    publish_date: number; 
    genres: mongoose.Types.ObjectId[]; 
    createdAt: Date; 
    updatedAt: Date; 
}

const MangaSchema: Schema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
        name: { type: String, required: true }, 
        status: { type: Number, required: true }, 
        imageUrl: { type: String, required: true }, 
        summary: { type: String, required: true }, 
        author: { 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'authors', 
            required: true 
        },
        isDeleted: { type: Boolean, default: false }, 
        publisher: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'publishers', 
            required: true 
        },
        views: { type: Number, default: 0 }, 
        publish_date: { type: Number, required: true }, 
        genres: { 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'genres', 
            required: true 
        }
    },
    {
        timestamps: true, 
    }
);


const MangaModel = mongoose.model<Manga>('manga', MangaSchema);
export default MangaModel;
