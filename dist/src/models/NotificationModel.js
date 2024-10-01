"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, {
    timestamps: true
});
const NotificationModel = mongoose_1.default.model('notifications', NotificationSchema);
exports.default = NotificationModel;
