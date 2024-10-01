"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RatingSchema = new mongoose_1.default.Schema({
    star: { type: Number, required: true, min: 0, max: 5 },
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
    timestamps: true
});
const RatingModel = mongoose_1.default.model('ratings', RatingSchema);
exports.default = RatingModel;
