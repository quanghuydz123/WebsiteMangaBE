import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the notification
 *         content:
 *           type: string
 *           description: The content of the notification
 *         isRead:
 *           type: boolean
 *           description: Indicates whether the notification has been read
 *         isViewed:
 *           type: boolean
 *           description: Indicates whether the notification has been viewed
 *         user:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user associated with the notification
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the notification was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the notification was last updated
 */

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