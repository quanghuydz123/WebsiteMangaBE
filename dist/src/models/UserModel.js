"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userName: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    account_type: { type: String, required: true },
    reading_history: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'chapters'
        }],
    role: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    }
}, {
    timestamps: true
});
const UserModel = mongoose_1.default.model('users', UserSchema);
exports.default = UserModel;
