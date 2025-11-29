// const User = require("../models/User");
// const Analysis = require("../models/Analysis");

// // Get all users (admin only)
// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.find({}).select("-password");
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Get all analyses (admin only)
// exports.getAllAnalyses = async (req, res) => {
//     try {
//         const analyses = await Analysis.find({}).populate("userId", "email");
//         res.json(analyses);
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Delete user (admin only)
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (user) {
//             // Also delete all analyses by this user
//             await Analysis.deleteMany({userId: user._id});
//             await User.findByIdAndDelete(req.params.id);
//             res.json({message: "User removed"});
//         } else {
//             res.status(404).json({message: "User not found"});
//         }
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Delete analysis (admin only)
// exports.deleteAnalysis = async (req, res) => {
//     try {
//         const analysis = await Analysis.findById(req.params.id);

//         if (analysis) {
//             await Analysis.findByIdAndDelete(req.params.id);
//             res.json({message: "Analysis removed"});
//         } else {
//             res.status(404).json({message: "Analysis not found"});
//         }
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };


const User = require("../models/User");
const Analysis = require("../models/Analysis");
const fs = require("fs");
const path = require("path");

// Get all users (admin only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({createdAt: -1});
        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Server error: " + error.message});
    }
};

// Get all analyses across all users (admin only)
exports.getAllAnalyses = async (req, res) => {
    try {
        // Populate userId to get user email
        const analyses = await Analysis.find({})
            .populate("userId", "email")
            .sort({createdAt: -1});
        
        res.json(analyses);
    } catch (error) {
        console.error("Error fetching all analyses:", error);
        res.status(500).json({message: "Server error: " + error.message});
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Prevent deleting admin users
        if (user.isAdmin) {
            return res.status(403).json({message: "Cannot delete admin users"});
        }

        // Delete all analyses belonging to this user
        const userAnalyses = await Analysis.find({userId: user._id});
        
        for (const analysis of userAnalyses) {
            // Delete associated files
            let filePath;
            if (analysis.filePath) {
                filePath = analysis.filePath;
            } else if (analysis.filename) {
                filePath = path.join(__dirname, "../uploads", analysis.filename);
            } else {
                filePath = path.join(__dirname, "../uploads", `${analysis._id}.json`);
            }

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete all analyses
        await Analysis.deleteMany({userId: user._id});

        // Delete user
        await User.findByIdAndDelete(req.params.id);

        res.json({message: "User and associated data deleted successfully"});
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({message: "Server error: " + error.message});
    }
};

// Delete an analysis (admin only)
exports.deleteAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({message: "Analysis not found"});
        }

        // Delete associated file
        let filePath;
        if (analysis.filePath) {
            filePath = analysis.filePath;
        } else if (analysis.filename) {
            filePath = path.join(__dirname, "../uploads", analysis.filename);
        } else {
            filePath = path.join(__dirname, "../uploads", `${analysis._id}.json`);
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Analysis.findByIdAndDelete(req.params.id);

        res.json({message: "Analysis deleted successfully"});
    } catch (error) {
        console.error("Error deleting analysis:", error);
        res.status(500).json({message: "Server error: " + error.message});
    }
};

// Get admin statistics
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAnalyses = await Analysis.countDocuments();
        
        // Count analyses with chart configurations
        const totalCharts = await Analysis.countDocuments({ 
            "chartConfig.xAxis": { $exists: true, $ne: null },
            "chartConfig.yAxis": { $exists: true, $ne: null }
        });
        
        // Count analyses with AI insights
        const totalAIInsights = await Analysis.countDocuments({ 
            "summary": { $exists: true, $ne: '' } 
        });

        res.json({
            totalUsers,
            totalAnalyses,
            chartsGenerated: totalCharts,
            aiInsights: totalAIInsights
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Get all user histories (analyses with user data)
exports.getAllUserHistories = async (req, res) => {
    try {
        const analyses = await Analysis.find({})
            .populate("userId", "email")
            .sort({ createdAt: -1 });
        
        res.json(analyses);
    } catch (error) {
        console.error("Error fetching user histories:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};