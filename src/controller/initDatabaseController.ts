import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import AuthorModel from '../models/AuthorModel';
import ChapterModel from '../models/ChapterModel';
import CommentModel from '../models/CommentModel';
import FollowingModel from '../models/FollowingModel';
import GenreModel from '../models/GenreModel';
import MangaModel from '../models/MangaModel';
import NotificationModel from '../models/NotificationModel';
import PublisherModel from '../models/PublisherModel';
import RatingModel from '../models/RatingModel';
import RoleModel from '../models/RoleModel';
import UserModel from '../models/UserModel';


export const importAllData = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../database.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const dbData = JSON.parse(jsonData).db_CMPMM;

        // Import data into each collection
        if (dbData.tb_Manga) await MangaModel.insertMany(dbData.tb_Manga);
        if (dbData.tb_Genre) await GenreModel.insertMany(dbData.tb_Genre);
        if (dbData.tb_Following) await FollowingModel.insertMany(dbData.tb_Following);
        if (dbData.tb_Comment) await CommentModel.insertMany(dbData.tb_Comment);
        if (dbData.tb_Rating) await RatingModel.insertMany(dbData.tb_Rating);
        if (dbData.tb_Chapter) await ChapterModel.insertMany(dbData.tb_Chapter);
        if (dbData.tb_Notification) await NotificationModel.insertMany(dbData.tb_Notification);
        if (dbData.tb_Role) await RoleModel.insertMany(dbData.tb_Role);
        if (dbData.tb_User) await UserModel.insertMany(dbData.tb_User);
        if (dbData.tb_Author) await AuthorModel.insertMany(dbData.tb_Author);
        if (dbData.tb_Publisher) await PublisherModel.insertMany(dbData.tb_Publisher);

        res.json({ message: 'All data imported successfully!' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to import data', details: error.message });
    }
};
