import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CNPMM Database API',
      version: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok', // Set timezone to GMT+7
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false // Set to true for 12-hour format if preferred
      }),
      description: 'API documentation for CMPMM MongoDB integration',
    },
    servers: [
      {
        url: process.env.SERVER_API || 'http://localhost:3001', // Change this based on your environment
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, specify the format if necessary
        },
      },
    },
    security: [
      {
        Bearer: [], // Apply Bearer security globally
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js', './src/models/*.ts', './src/models/*.js'], // This will point to the routes for swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
