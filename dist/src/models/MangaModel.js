"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const MangaSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    status: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    summary: { type: String, required: true },
    author: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'authors',
        required: true
    },
    isDeleted: { type: Boolean, default: false },
    publisher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'publishers',
        required: true
    },
    views: { type: Number, default: 0 },
    publish_date: { type: Date, required: true },
    genres: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'genres',
        required: true
    }
}, {
    timestamps: true,
});
MangaSchema.plugin(mongoose_paginate_v2_1.default);
// const MangaModel = mongoose.model<Manga>('mangas', MangaSchema);
const MangaModel = mongoose_1.default.model('mangas', MangaSchema);
exports.default = MangaModel;
