// const mongoose = require("mongoose");

// const analysisSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         filename: {
//             type: String,
//             required: true,
//         },
//         originalName: {
//             type: String,
//             required: true,
//         },
//         // data: [
//         //     {
//         //         type: Object,
//         //     },
//         // ],

//         filePath: {
//             type: String,
//             required: true,
//         },
//         columns: [
//             {
//                 type: String,
//             },
//         ],
//         chartType: {
//             type: String,
//         },
//         xAxis: {
//             type: String,
//         },
//         yAxis: {
//             type: String,
//         },
//        chartConfig: {
//             type: mongoose.Schema.Types.Mixed,  // Flexible for {chartType, xAxis, yAxis, title}
//             default: null,
//         },
//         summary: {
//             type: String,
//         },
//         rowCount: {
//             type: Number,
//             default: 0,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// module.exports = mongoose.model("Analysis", analysisSchema);



// server/models/Analysis.js should have:
const mongoose = require("mongoose");
const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: String,
    originalName: String,
    filePath: String,
    columns: [String],
    rowCount: Number,
    
    // Chart configuration
    chartConfig: {
        chartType: String,
        xAxis: String,
        yAxis: String,
        title: String
    },
    
    // Legacy fields (for backward compatibility)
    chartType: String,
    xAxis: String,
    yAxis: String,
    
    // AI insights
    summary: String,
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Analysis", analysisSchema);