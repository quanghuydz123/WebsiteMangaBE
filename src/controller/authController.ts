
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const generateJWT = async (req: Request, res: Response) => {

    try {
        // Ensure user exists before accessing properties
        if (!req.user) {
            return res.status(401).send('User not authenticated');
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
        res.redirect(`http://localhost:3000?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);

        // Redirect to the frontend with user info
    } catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).send('Internal Server Error');
    }
};

const generateSwaggerJWT = async (req: Request, res: Response) => {
    try {
        // Ensure user exists before accessing properties
        if (!req.user) {
            return res.status(401).send('User not authenticated');
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