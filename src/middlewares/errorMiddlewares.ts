import { Request, Response, NextFunction } from 'express';

const errorMiddleHandle = (err: any, _req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        statusCode,
    });
};

export default errorMiddleHandle;
