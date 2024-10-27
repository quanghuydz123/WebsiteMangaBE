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
        timestamps: true,
        toJSON: { virtuals: true, versionKey: false }, // Remove __v
        toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
        id: false // Disable the virtual id field 
    }
);
/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the role
 *         name:
 *           type: string
 *           description: The name of the role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the role was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the role was last updated
 */
const RoleModel = mongoose.model<Role>('roles', RoleSchema);
export default RoleModel;