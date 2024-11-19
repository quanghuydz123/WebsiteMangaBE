import mongoose, { Schema, Document } from 'mongoose';

// APIPramsModel Schema to track API route and parameters
const APIParamsSchema = new Schema({
    apiRoute: { type: String, required: true }, // The API route
    params: { type: String, required: true }, // The query parameters as a string (e.g., "page-4-mangaId-0004")
}, {
    timestamps: false,
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
    id: false // Disable the virtual id field
}
);

// Create a model for APIPramsSchema
const APIParamsModel = mongoose.model<IAPIParams>('APIParams', APIParamsSchema);

// Define the TypeScript Document interface
export interface IAPIParams {
    apiRoute: string;
    params: string;
}

export default APIParamsModel;
