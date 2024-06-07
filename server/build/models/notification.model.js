"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Mongoose library and its components
const mongoose_1 = __importStar(require("mongoose"));
// Create a Mongoose Schema object for the INotification interface
const notificationSchema = new mongoose_1.Schema({
    // Define the title field (required)
    title: {
        type: String,
        required: true,
    },
    // Define the message field (required)
    message: {
        type: String,
        required: true,
    },
    // Define the status field (required, defaults to "unread")
    status: {
        type: String,
        required: true,
        default: "unread",
    },
}, 
// Enable timestamps for tracking createdAt and updatedAt fields
{ timestamps: true });
// Create a Mongoose Model object using the notificationSchema and the "Notification" model name
const NotificationModel = mongoose_1.default.model("Notification", notificationSchema);
// Export the NotificationModel for use in other parts of the application
exports.default = NotificationModel;
