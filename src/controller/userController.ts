import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { Request, Response } from 'express'; // Import Request and Response

dotenv.config();

const getAll = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "Thành công"
    });
});

export default { getAll };
