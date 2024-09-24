import mongoose, { Schema, Document } from 'mongoose';

export interface Publisher extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string; 
    isDeleted: boolean; 
    createdAt: Date; 
    updatedAt: Date; 
}

const PublisherSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true }, 
        isDeleted: { type: Boolean, default: false } 
    },
    {
        timestamps: true 
    }
);
const PublisherModel = mongoose.model<Publisher>('publishers', PublisherSchema);
export default PublisherModel;
