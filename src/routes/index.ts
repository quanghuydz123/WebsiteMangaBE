import { Express } from 'express';
import roleRouter from './roleRoute';
import userRouter from './userRoute';
import publisherRoute from './publisherRoute';
import authorRoute from './authorRoute';
import genreRoute from './genreRoute';
import mangaRoute from './mangaRoute';
import chapterRoute from './chapterRoute';
import followingRoute from './followingRoute';
import commentRoute from './commentRoute';
import ratingRoute from './ratingRoute';
import notificationRoute from './notificationRoute';

const routes = (app: Express) => {
    app.use('/users', userRouter);
    app.use('/roles', roleRouter);
    app.use('/publishers', publisherRoute);
    app.use('/authors', authorRoute);
    app.use('/genres', genreRoute);
    app.use('/manga', mangaRoute);
    app.use('/chapters', chapterRoute);
    app.use('/followings', followingRoute);
    app.use('/ratings', ratingRoute);
    app.use('/comments', commentRoute);
    app.use('/notifications', notificationRoute);
};

export default routes;
