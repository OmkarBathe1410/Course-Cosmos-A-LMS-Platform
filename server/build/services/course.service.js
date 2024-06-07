"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoursesService = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model")); // Importing the CourseModel for creating a new course
const catchAsyncError_1 = require("../middleware/catchAsyncError"); // Importing the CatchAsyncError middleware for handling asynchronous errors
const redis_1 = require("../utils/redis");
// Define the createCourse function wrapped with the CatchAsyncError middleware
exports.createCourse = (0, catchAsyncError_1.CatchAsyncError)(async (data, res) => {
    // Create a new course using the provided data
    const course = await course_model_1.default.create(data);
    await redis_1.redis.set(course._id, JSON.stringify(course), "EX", 604800);
    const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
    await redis_1.redis.set("allCourses", JSON.stringify(courses));
    // Return a JSON response with a success status and the created course object
    res.status(200).json({
        success: true,
        course,
    });
});
// Define an asynchronous function getAllCoursesService that takes an Express.js Response object as a parameter
const getAllCoursesService = async (res) => {
    // Use the CourseModel to fetch all courses from the database and sort them by the 'createdAt' field in descending order
    const courses = await course_model_1.default.find().sort({ createdAt: -1 });
    // Send a JSON response with a status code of 201 (indicating success in this context) and the array of course objects
    res.status(201).json({
        success: true,
        courses,
    });
};
exports.getAllCoursesService = getAllCoursesService;
