import mongoose, { Schema, Document } from 'mongoose';

export interface Notification extends Document {
    _id: mongoose.Types.ObjectId; 
    content: string; 
    isRead: boolean; 
    isViewed: boolean; 
    user: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
}

const NotificationSchema: Schema = new mongoose.Schema(
    {
        content: { type: String, required: true }, 
        isRead: { type: Boolean, default: false }, 
        isViewed: { type: Boolean, default: false }, 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const NotificationModel = mongoose.model<Notification>('Notification', NotificationSchema);
export default NotificationModel;