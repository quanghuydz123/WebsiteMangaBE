import mongoose, { Schema, Document } from 'mongoose';

// ModelModified Schema to track the last modification timestamp for models
const ModelModifiedSchema = new Schema({
    modelName: { type: String, required: true,unique:true }, // The name of the model (e.g., 'comments')
    updatedAt: { type: Date, default: Date.now }, // The timestamp when the model was last modified
}, {
    timestamps: false,
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
    id: false // Disable the virtual id field
});

// Create a model for ModelModifiedSchema
const ModelModified = mongoose.model<ModelModifiedDocument>('ModelModified', ModelModifiedSchema);

// Define the TypeScript Document interface
interface ModelModifiedDocument extends Document {
    modelName: string;
    updatedAt: Date;
}

export default ModelModified;
