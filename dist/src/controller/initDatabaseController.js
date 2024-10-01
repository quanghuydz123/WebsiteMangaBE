"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importAllData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const AuthorModel_1 = __importDefault(require("../models/AuthorModel"));
const ChapterModel_1 = __importDefault(require("../models/ChapterModel"));
const CommentModel_1 = __importDefault(require("../models/CommentModel"));
const FollowingModel_1 = __importDefault(require("../models/FollowingModel"));
const GenreModel_1 = __importDefault(require("../models/GenreModel"));
const MangaModel_1 = __importDefault(require("../models/MangaModel"));
const NotificationModel_1 = __importDefault(require("../models/NotificationModel"));
const PublisherModel_1 = __importDefault(require("../models/PublisherModel"));
const RatingModel_1 = __importDefault(require("../models/RatingModel"));
const RoleModel_1 = __importDefault(require("../models/RoleModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const importAllData = async (req, res) => {
    try {
        const filePath = path_1.default.join(__dirname, '../database.json');
        const jsonData = fs_1.default.readFileSync(filePath, 'utf8');
        const dbData = JSON.parse(jsonData).db_CMPMM;
        // Import data into each collection
        if (dbData.tb_Manga)
            await MangaModel_1.default.insertMany(dbData.tb_Manga);
        if (dbData.tb_Genre)
            await GenreModel_1.default.insertMany(dbData.tb_Genre);
        if (dbData.tb_Following)
            await FollowingModel_1.default.insertMany(dbData.tb_Following);
        if (dbData.tb_Comment)
            await CommentModel_1.default.insertMany(dbData.tb_Comment);
        if (dbData.tb_Rating)
            await RatingModel_1.default.insertMany(dbData.tb_Rating);
        if (dbData.tb_Chapter)
            await ChapterModel_1.default.insertMany(dbData.tb_Chapter);
        if (dbData.tb_Notification)
            await NotificationModel_1.default.insertMany(dbData.tb_Notification);
        if (dbData.tb_Role)
            await RoleModel_1.default.insertMany(dbData.tb_Role);
        if (dbData.tb_User)
            await UserModel_1.default.insertMany(dbData.tb_User);
        if (dbData.tb_Author)
            await AuthorModel_1.default.insertMany(dbData.tb_Author);
        if (dbData.tb_Publisher)
            await PublisherModel_1.default.insertMany(dbData.tb_Publisher);
        res.json({ message: 'All data imported successfully!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to import data', details: error.message });
    }
};
exports.importAllData = importAllData;
