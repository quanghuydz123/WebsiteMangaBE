import express from 'express';
import userRouter from './userRoute';
import roleRouter from './roleRoute';

const routes = (app: express.Application) => {
    app.use('/users', userRouter);
    app.use('/roles',roleRouter)
};

export default routes;
