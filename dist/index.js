"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./src/routes"));
const connectDb_1 = __importDefault(require("./src/configs/connectDb"));
const errorMiddlewares_1 = __importDefault(require("./src/middlewares/errorMiddlewares"));
const swagger_1 = require("./src/middlewares/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, routes_1.default)(app);
(0, swagger_1.setupSwagger)(app);
app.use(errorMiddlewares_1.default);
const http = require('http').Server(app);
// Directly call the function
(0, connectDb_1.default)(app);
http.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
