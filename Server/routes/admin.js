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
