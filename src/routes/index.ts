import express from 'express';
import userRouter from './userRoute';
import roleRouter from './roleRoute';
import helloRouter from './helloRoute';

const routes = (app: express.Application) => {
    app.use('/users', userRouter);
    app.use('/roles', roleRouter);
    app.use('/hello', helloRouter); // Register /hello route
};

export default routes;
