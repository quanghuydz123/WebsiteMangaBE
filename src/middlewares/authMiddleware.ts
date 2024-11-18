import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GenericResponse } from '../models/GenericResponse';
// Role-based access control middleware
export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const response: GenericResponse<null> = {
            message: "không có thông tin về quyền truy cập",
            data: null
        }
        // Assuming req.user contains the user information set in authenticateJWT middleware
        if (!req.user || !req.user.roleId) {
            return res.status(403).json(response); // Forbidden if user or roleId is not present
        }

        // Check if the user's role is one of the allowed roles
        if (!allowedRoles.includes(req.user.roleId)) {
            response.message = "truy cập quá thẩm quyền quy định";
            return res.status(403).json(response); // Forbidden if user does not have access
        }

        next(); // User has the right role, proceed to the next middleware/route
    };
};

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt; // Get token from cookies
    if (!token) {
        return res.status(403).json({ error: 'Access denied: No token provided.' }); // Improved error message
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            console.error('JWT verification error:', err); // Log the error for server-side tracking
            return res.status(403).json({ error: 'Access denied: Invalid token.' }); // Improved error message
        }
        if(user.roleId ===  process.env.ADMIN_ROLE_ID){
            req.user = user; // Attach the user information to the request
            next()
        }else{
            res.status(400); // Not Found
            throw new Error('Bạn có không quyền thực hiện thao tác này');
        }
       
    });

};

export const authUserMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt; // Get token from cookies
    const {id,idUser} = req.query
    const idUserBody = req.body?.idUser
    const idUserBody1 = req.body?.user
    if (!token) {
        return res.status(403).json({ error: 'Access denied: No token provided.' }); // Improved error message
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            console.error('JWT verification error:', err); // Log the error for server-side tracking
            return res.status(403).json({ error: 'Access denied: Invalid token.' }); // Improved error message
        }
        if(user.roleId ===  process.env.ADMIN_ROLE_ID || user.id  === id ||  user.id === idUser || user.id === idUserBody || user.id === idUserBody1){
            req.user = user; // Attach the user information to the request
            next()
        }else{
            res.status(400); // Not Found
            throw new Error('Bạn có không quyền thực hiện thao tác này');
        }
       
    });

};
