import mongoose, { Schema, Document } from 'mongoose';

export interface Comment extends Document {
    _id: mongoose.Types.ObjectId; 
    idUser: mongoose.Types.ObjectId; 
    text: string;
    isDeleted: boolean;
    createAt: Date; 
    updatedAt: Date; 
    idManga: mongoose.Types.ObjectId; 
}

const CommentSchema: Schema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
        idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, 
        text: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        idManga: { type: mongoose.Schema.Types.ObjectId, ref: 'manga', required: true } 
    },
    {
        timestamps: true, 
    }
);

const CommentModel = mongoose.model<Comment>('comments', CommentSchema);
export default CommentModel;