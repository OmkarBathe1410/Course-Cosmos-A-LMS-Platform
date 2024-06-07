"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripePublishableKey = exports.getAllOrdersForAdmin = exports.createOrder = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError"); // Importing error handling middleware
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler")); // Importing custom error handler
const user_model_1 = __importDefault(require("../models/user.model")); // Importing user model
const course_model_1 = __importDefault(require("../models/course.model")); // Importing course model
const path_1 = __importDefault(require("path")); // Importing Node's path module
const ejs_1 = __importDefault(require("ejs")); // Importing EJS library for templating
const sendEmail_1 = __importDefault(require("../utils/sendEmail")); // Importing sendEmail utility function
const notification_model_1 = __importDefault(require("../models/notification.model")); // Importing notification model
const order_service_1 = require("../services/order.service"); // Importing newOrder function
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.createOrder = (0, catchAsyncError_1.CatchAsyncError)(
// Exporting createOrder function wrapped in CatchAsyncError middleware
async (req, res, next) => {
    // Destructuring request, response, and next function
    try {
        // Starting try block to handle errors
        const { courseId, payment_info } = req.body; // Destructuring courseId and payment_info from request body
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler_1.default("Payment not authorized!", 400));
                }
            }
        }
        const user = await user_model_1.default.findById(req.user?._id); // Finding user by ID
        const courseExistsInUser = user?.courses.some(
        // Checking if user already has the course
        (course) => course._id.toString() === courseId);
        if (courseExistsInUser) {
            // If user has the course, return error
            return next(new ErrorHandler_1.default("You've already purchased this course", 400));
        }
        const course = await course_model_1.default.findById(courseId); // Finding course by ID
        if (!course) {
            // If course is not found, return error
            return next(new ErrorHandler_1.default("Course not found!", 404));
        }
        const data = {
            // Creating order data
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };
        const mailData = {
            // Creating data for email
            order: {
                _id: courseId.toString().slice(0, 6),
                user_name: user?.name,
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };
        const html = await ejs_1.default.renderFile(
        // Rendering email template with data
        path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            // Try block for sending email
            if (user) {
                // If user exists, send email confirmation
                await (0, sendEmail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            // If there's an error sending the email, log it and continue with the order creation
            console.error("Error sending email:", error.message);
        }
        course.purchased = course.purchased + 1;
        await course.save(); // Saving the updated course
        user?.courses.push(courseId); // Adding the course to the user's list of courses
        await user?.save(); // Saving the updated user
        const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        await redis_1.redis.set("allCourses", JSON.stringify(courses));
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
        await notification_model_1.default.create({
            // Creating a new notification
            user: user?._id,
            title: "New Order",
            message: `You have a new order for ${course?.name} from ${user?.name}`,
        });
        (0, order_service_1.newOrder)(data, res, next); // Calling the newOrder function with the order data, response, and next function
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500)); // Returning an error if there's an issue during the process
    }
});
// Define an asynchronous function getAllOrdersForAdmin wrapped with CatchAsyncError to handle any errors
exports.getAllOrdersForAdmin = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Call getAllOrdersService to fetch and send all orders as a JSON response
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        // If an error occurs, create a new ErrorHandler with the error message and status code 400 (Bad Request)
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.sendStripePublishableKey = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        res.status(200).json({
            publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.newPayment = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "INR",
            metadata: {
                company: "Course Cosmos",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.status(200).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
