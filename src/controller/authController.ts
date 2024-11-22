
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import UserModel, { IUser } from '../models/UserModel';

dotenv.config();
const generateJWT = async (req: Request, res: Response) => {

    try {
        if (req.user && req.user.id) {
            const userFromDatabase: IUser | null = await UserModel.findById(req.user.id, { isDeleted: 1 });
            if (!userFromDatabase || userFromDatabase.isDeleted) {
                // Reset user cookie before returning
                res.cookie('jwt', '', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    expires: new Date(0), // Expire the cookie immediately
                });
                res.status(403).json({ message: "User is blocked", data: null });
                return;
            }
        }
        // Generate a JWT token
        const token = jwt.sign(
            { id: req.user._id, roleId: req.user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Set the token as a cookie with cross-domain options
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // Required for cross-domain cookie
            maxAge: 604800000,
        });
        const origin = req.get('origin') || req.get('referer');
        const frontendURL = origin != 'http://localhost:3000' ? `${process.env.FRONTEND_API}/WebsiteMangaFE/#` : 'http://localhost:3000';
        res.redirect(`${frontendURL}?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);

        // Redirect to the frontend with user info
    } catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).send('Internal Server Error');
    }
};

const generateSwaggerJWT = async (req: Request, res: Response):Promise<void> => {
    try {
        // Ensure user exists before accessing properties
        if (!req.user) {
            res.status(401).send('User not authenticated');
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ id: req.user._id, roleId: req.user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        //  set the token as a cookie
        res.cookie('jwt', token, { httpOnly: true });


        res.render('login_page', { user: req.user });


        // Redirect to the frontend with user info
    } catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).send('Internal Server Error');
    }
};


export default {
    generateJWT,
    generateSwaggerJWT
}