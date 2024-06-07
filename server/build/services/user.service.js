"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const redis_1 = require("../utils/redis");
const user_model_1 = __importDefault(require("../models/user.model"));
// Define an asynchronous function getUserById that takes a user's ID and an Express.js Response object as parameters
const getUserById = async (id, res) => {
    // Use the redis client instance to fetch the user data from the Redis database based on the provided user ID
    const userJSON = await redis_1.redis.get(id);
    // Check if the user data exists in the Redis database
    if (userJSON) {
        // Parse the user data from a JSON string to a JavaScript object
        const user = JSON.parse(userJSON);
        // Send a JSON response with a status code of 201 (indicating success in this context) and the user object
        res.status(201).json({
            success: true,
            user,
        });
    }
};
exports.getUserById = getUserById;
// Define an asynchronous function getAllUsersService that takes an Express.js Response object as a parameter
const getAllUsersService = async (res) => {
    // Use the userModel to fetch all users from the database and sort them by the 'createdAt' field in descending order
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    // Send a JSON response with a status code of 201 (indicating success in this context) and the array of user objects
    res.status(201).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
/* This asynchronous function updates the role of a user and sends a response with the updated user details.
   It takes the following parameters:
    - id: The unique identifier of the user.
    - role: The new role to assign to the user.
    - res: The response object used to send a response back to the client.
*/
const updateUserRoleService = async (email, role, res) => {
    /* Find the user with the specified id and update their role. The { new: true } option
       ensures that the function returns the updated user document. */
    const user = await user_model_1.default.findOneAndUpdate({ email }, { role }, { new: true });
    /* Set the HTTP status code to 201 (Created) and send a JSON response with the
       following properties:
        - success: A boolean indicating that the update was successful.
        - user: The updated user document. */
    res.status(201).json({
        success: true,
        user,
    });
};
exports.updateUserRoleService = updateUserRoleService;
