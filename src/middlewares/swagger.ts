import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CNPMM Database API',
      version: '1.0.0',
      description: 'API documentation for CMPMM MongoDB integration',
    },
    servers: [
      {
        url: process.env.SERVER_API_URL || 'http://localhost:3001', // Change this based on your environment
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js', './src/models/*.ts', './src/models/*.js'], // This will point to the routes for swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
