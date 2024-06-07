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
// Create a Mongoose Schema object for the IOrder interface
const orderSchema = new mongoose_1.Schema({
    // Define the courseId field (required)
    courseId: {
        type: String,
        required: true,
    },
    // Define the userId field (required)
    userId: {
        type: String,
        required: true,
    },
    // Define the payment_info field (not required)
    payment_info: {
        type: Object,
    },
}, 
// Enable timestamps for tracking createdAt and updatedAt fields
{ timestamps: true });
// Create a Mongoose Model object using the orderSchema and the "Order" model name
const OrderModel = mongoose_1.default.model("Order", orderSchema);
// Export the OrderModel for use in other parts of the application
exports.default = OrderModel;
