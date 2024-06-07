"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("./middleware/error");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const express_rate_limit_1 = require("express-rate-limit");
require("dotenv").config();
exports.app = (0, express_1.default)();
// Parse incoming requests with JSON payloads and set payload size limit to 50mb
exports.app.use(express_1.default.json({ limit: "50mb" }));
// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
exports.app.use((0, cookie_parser_1.default)());
// Enable CORS with the specified origin from environment variables
exports.app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
// API Request Limit:
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
// Mount the userRouter under the "/api/v1" path prefix
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default);
// Test route to check if the API is working
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
// Middleware to handle undefined routes and return a 404 error
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found!`);
    err.statusCode = 404; // Set status code to 404 for not found errors
    next(err); // Pass the error to the error handling middleware
});
// Apply custom error handling middleware to handle errors
exports.app.use(error_1.ErrorMiddleWare);
// Apply API request limiter:
exports.app.use(limiter);
exports.default = exports.app;
