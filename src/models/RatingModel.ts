import mongoose, { Schema, Document } from 'mongoose';

export interface Rating extends Document {
    _id: mongoose.Types.ObjectId; 
    star: number; 
    idUser: mongoose.Types.ObjectId; 
    idManga: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const RatingSchema: Schema = new mongoose.Schema(
    {
        star: { type: Number, required: true, min: 0, max: 5 }, 
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

const RatingModel = mongoose.model<Rating>('ratings', RatingSchema);
export default RatingModel;
