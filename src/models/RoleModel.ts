import mongoose, { Schema, Document } from 'mongoose';

export interface Role extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string; 
    createdAt: Date; 
    updatedAt: Date; 
}

const RoleSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true } 
    },
    {
        timestamps: true 
    }
);

const RoleModel = mongoose.model<Role>('Role', RoleSchema);
export default RoleModel;