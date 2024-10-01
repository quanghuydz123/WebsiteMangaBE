"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GenreSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
    id: false // Disable the virtual id field
});
const GenreModel = mongoose_1.default.model('genres', GenreSchema);
exports.default = GenreModel;
