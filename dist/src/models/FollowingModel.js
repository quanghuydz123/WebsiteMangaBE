"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FollowingSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    manga: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'mangas',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Also applies to plain objects
    id: false // Disable the virtual id field
});
const FollowingModel = mongoose_1.default.model('followings', FollowingSchema);
exports.default = FollowingModel;
