import express from 'express';
import passport from '../configs/passport-setup';
import swaggerMode from '../configs/passport-swagger';
import authController from '../controller/authController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';


const authRouter = express.Router();
// Standard Google Authentication
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: FRONT END gọi API này khi người dùng nhấn vào biểu tượng Google
 *     tags: [Auth]
 *     description: thông tin của người dùng sẽ được trả về trên thanh tìm kiếm của trình duyệt. không cần bearer. do lưu thẳng vào cookie rồi
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication.
 *       500:
 *         description: Internal server error.
 */
authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Swagger Google Authentication
authRouter.get('/swagger/google', swaggerMode.passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Standard Google Callback
authRouter.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), 
    authController.generateJWT
);

// Swagger Callback
authRouter.get('/swagger/google/callback', 
    swaggerMode.passport.authenticate('google', { failureRedirect: '/' }), 
    authController.generateSwaggerJWT
);

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Retrieve a protected user route (kiểm tra xem USER có đăng nhập được không)
 *     tags: [Auth]
 *     description: This route is accessible only to users with the reader role.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: A protected user route response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is a protected user route
 *                 user:
 *                   type: object
 *                   description: The authenticated user information
 *       403:
 *         description: Forbidden - user does not have the required role
 *       401:
 *         description: Unauthorized - token is missing or invalid
 */
authRouter.get('/protected', authenticateJWT, authorizeRoles([process.env.READER_ROLE_ID!]), (req, res) => {
    res.json({ message: 'This is a protected user route', user: req.user });
});
/**
 * @swagger
 * /auth/protected2:
 *   get:
 *     summary: Retrieve a protected admin route (kiểm tra xem ADMIN có đăng nhập được hay không)
 *     tags: [Auth]
 *     description: This route is accessible only to users with the admin role.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: A protected admin route response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is a protected admin route
 *                 user:
 *                   type: object
 *                   description: The authenticated user information
 *       403:
 *         description: Forbidden - user does not have the required role
 *       401:
 *         description: Unauthorized - token is missing or invalid
 */
authRouter.get('/protected2', authenticateJWT, authorizeRoles([process.env.ADMIN_ROLE_ID!]), (req, res) => {
    res.json({ message: 'This is a protected admin route', user: req.user });
});
authRouter.get('/login-ui', (req, res) => {
    res.render('login_page', { user: req.user || null })
})
export default authRouter;
