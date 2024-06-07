"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const layout_model_1 = __importDefault(require("../models/layout.model"));
// Export the 'createLayout' function wrapped in the CatchAsyncError middleware.
exports.createLayout = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Destructure 'type' property from the request body.
        const { type } = req.body;
        // Check if a layout with the same 'type' already exists in the database.
        const isTypeExist = await layout_model_1.default.findOne({ type });
        // If a layout with the same 'type' exists, return a 400 error.
        if (isTypeExist) {
            return next(new ErrorHandler_1.default(`${type} already exist`, 400));
        }
        // If 'type' is 'FAQ'...
        if (type === "FAQ") {
            // Destructure the 'faq' property from the request body.
            const { faq } = req.body;
            // Create an array of 'question'-'answer' objects from 'faq' items.
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            // Create a new layout with 'type' 'FAQ'.
            await layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        // If 'type' is 'Categories'...
        if (type === "Categories") {
            // Destructure the 'categories' property from the request body.
            const { categories } = req.body;
            // Create an array of 'title' objects from 'categories' items.
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            // Create a new layout with 'type' 'Categories'.
            await layout_model_1.default.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        // Return a 200 status code with a success message.
        res.status(200).json({
            success: true,
            message: "Layout Created Successfully!",
        });
    }
    catch (error) {
        // If there is an error, return a 500 status code with an error message.
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Export the 'editLayout' function wrapped in the CatchAsyncError middleware.
exports.editLayout = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Destructure the 'type' property from the request body.
        const { type } = req.body;
        // If the 'type' is 'FAQ'...
        if (type === "FAQ") {
            // Destructure the 'faq' property from the request body.
            const { faq } = req.body;
            // Find one layout document with the type 'FAQ'.
            const faqData = await layout_model_1.default.findOne({ type: "FAQ" });
            // Create an array of 'question'-'answer' objects from 'faq' items.
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            // Update the FAQ layout with the new 'faq' items.
            await layout_model_1.default.findOneAndUpdate(faqData?._id, {
                type: "FAQ",
                faq: faqItems,
            });
        }
        // If the 'type' is 'Categories'...
        if (type === "Categories") {
            // Destructure the 'categories' property from the request body.
            const { categories } = req.body;
            // Find one layout document with the type 'Categories'.
            const categoriesData = await layout_model_1.default.findOne({
                type: "Categories",
            });
            // Create an array of 'title' objects from 'categories' items.
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            // Update the Categories layout with the new 'categories' items.
            await layout_model_1.default.findByIdAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }
        // Send a 200 status code and a success message in the response.
        res.status(200).json({
            success: true,
            message: "Layout Updated Successfully!",
        });
    }
    catch (error) {
        // If an error occurs, call the ErrorHandler with the error message and a 500 status code.
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Export the 'getLayoutByType' function wrapped in the CatchAsyncError middleware.
exports.getLayoutByType = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Destructure the 'type' property from the request body.
        const { type } = req.params;
        // Find one layout document with the provided 'type'.
        const layout = await layout_model_1.default.findOne({ type });
        // Send a 201 status code and the retrieved 'layout' object in the response.
        res.status(201).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        // If an error occurs, call the ErrorHandler with the error message and a 500 status code.
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
