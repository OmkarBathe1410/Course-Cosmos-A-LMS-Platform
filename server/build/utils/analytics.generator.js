"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast12MonthsData = void 0;
// Function to generate data for the last 12 months for a given Mongoose model
async function generateLast12MonthsData(model) {
    // Initialize an empty array to store monthly data
    const last12Months = [];
    // Get the current date and set it to the first day of the current month
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    // Loop through the last 12 months, starting from 11 months ago up to the current month
    for (let i = 11; i >= 0; i--) {
        // Calculate the end date for the current iteration
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
        // Calculate the start date for the current iteration
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
        // Convert the end date to a string in the format 'day-month-year'
        const monthYear = endDate.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        // Count the documents created within the current month
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        // Add the monthly data (month and count) to the last12Months array
        last12Months.push({ month: monthYear, count: count });
    }
    // Return an object containing the last 12 months' data
    return { last12Months };
}
exports.generateLast12MonthsData = generateLast12MonthsData;
