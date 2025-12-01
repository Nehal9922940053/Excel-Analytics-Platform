const express = require("express");
const {getUsers, getAllAnalyses, deleteUser, deleteAnalysis, getAdminStats,
    getAllUserHistories       } = require("../controllers/adminController");
const {protect, admin} = require("../middleware/auth");

const router = express.Router();

// All routes are protected and admin-only
router.use(protect, admin);

router.get("/users", getUsers);
router.get("/analyses", getAllAnalyses);
router.delete("/users/:id", deleteUser);
router.delete("/analyses/:id", deleteAnalysis);
router.get("/stats", getAdminStats);
router.get("/user-histories", getAllUserHistories);

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth");
// const { 
//     getUsers, 
//     getAllAnalyses, 
//     deleteUser, 
//     deleteAnalysis, 
//     getAdminStats, 
//     getAllUserHistories 
// } = require("../controllers/adminController");

// // Middleware to check if user is admin
// const adminOnly = (req, res, next) => {
//     if (!req.user.isAdmin) {
//         return res.status(403).json({ message: "Admin access required" });
//     }
//     next();
// };

// // Get all users
// router.get("/users", protect, adminOnly, getUsers);

// // Get all analyses
// router.get("/analyses", protect, adminOnly, getAllAnalyses);

// // Delete user
// router.delete("/users/:id", protect, adminOnly, deleteUser);

// // Delete analysis
// router.delete("/analyses/:id", protect, adminOnly, deleteAnalysis);

// // Get admin statistics (users, analyses, charts count)
// router.get("/stats", protect, adminOnly, getAdminStats);

// // Get all user histories (analyses with user data)
// router.get("/user-histories", protect, adminOnly, getAllUserHistories);

// module.exports = router;
