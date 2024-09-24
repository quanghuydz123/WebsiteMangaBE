import mongoose, { Schema, Document } from 'mongoose';

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