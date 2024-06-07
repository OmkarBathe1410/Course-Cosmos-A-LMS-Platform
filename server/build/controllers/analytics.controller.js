"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderAnalytics = exports.getCourseAnalytics = exports.getUserAnalytics = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const analytics_generator_1 = require("../utils/analytics.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
// Middleware function to handle user analytics requests
exports.getUserAnalytics = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Generate last 12 months' data for users
        const users = await (0, analytics_generator_1.generateLast12MonthsData)(user_model_1.default);
        // Respond with the generated data and a success status
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        // Pass a new ErrorHandler object to the next middleware function
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Middleware function to handle course analytics requests
exports.getCourseAnalytics = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Generate last 12 months' data for courses
        const courses = await (0, analytics_generator_1.generateLast12MonthsData)(course_model_1.default);
        // Respond with the generated data and a success status
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        // Pass a new ErrorHandler object to the next middleware function
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Middleware function to handle order analytics requests
exports.getOrderAnalytics = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Generate last 12 months' data for orders
        const orders = await (0, analytics_generator_1.generateLast12MonthsData)(order_model_1.default);
        // Respond with the generated data and a success status
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        // Pass a new ErrorHandler object to the next middleware function
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
