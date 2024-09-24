import mongoose, { Schema, Document } from 'mongoose';

export interface Author extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string;
    isDeleted: boolean;
    createAt: Date; 
    updatedAt: Date;
}

const AuthorSchema: Schema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);


const AuthorModel = mongoose.model<Author>('authors', AuthorSchema);
export default AuthorModel;
