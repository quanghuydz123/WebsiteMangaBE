import mongoose, { Schema, Document } from 'mongoose';

export interface Notification extends Document {
    _id: mongoose.Types.ObjectId; 
    content: string; 
    isRead: boolean; 
    isViewed: boolean; 
    idUser: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const NotificationSchema: Schema = new mongoose.Schema(
    {
        content: { type: String, required: true }, 
        isRead: { type: Boolean, default: false }, 
        isViewed: { type: Boolean, default: false }, 
        idUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

export const NotificationModel = mongoose.model<Notification>('Notification', NotificationSchema);