import mongoose, { Schema, Document } from 'mongoose';

export interface Following extends Document {
    _id: mongoose.Types.ObjectId; 
    idUser: mongoose.Types.ObjectId; 
    idManga: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const FollowingSchema: Schema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId }, 
        idUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        },
        idManga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'manga', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const FollowingModel = mongoose.model<Following>('followings', FollowingSchema);
export default FollowingModel;
