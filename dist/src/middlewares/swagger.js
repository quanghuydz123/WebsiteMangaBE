"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.setupSwagger = setupSwagger;
