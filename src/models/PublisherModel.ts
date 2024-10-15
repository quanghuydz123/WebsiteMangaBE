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
/**
 * @swagger
 * components:
 *   schemas:
 *     Publisher:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the publisher
 *         name:
 *           type: string
 *           description: The name of the publisher
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the publisher is deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the publisher was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the publisher was last updated
 */

const PublisherModel = mongoose.model<Publisher>('publishers', PublisherSchema);
export default PublisherModel;
