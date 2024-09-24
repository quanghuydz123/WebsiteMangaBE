import mongoose, { Schema, Document } from 'mongoose';

export interface Following extends Document {
    _id: mongoose.Types.ObjectId; 
    user: mongoose.Types.ObjectId; 
    manga: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const FollowingSchema: Schema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId }, 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        },
        manga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mangas', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const FollowingModel = mongoose.model<Following>('followings', FollowingSchema);
export default FollowingModel;
