// const express = require("express");
// const {getUserAnalyses, getAnalysis, getAnalysisData, saveChartConfig, generateInsights} = require("../controllers/dataController");
// const {protect} = require("../middleware/auth");

// const router = express.Router();

// router.get("/history", protect, getUserAnalyses);
// router.get("/:id", protect, getAnalysis);
// router.get("/:id/data", protect, getAnalysisData); // Make sure this line exists
// router.put("/:id/chart", protect, saveChartConfig);
// router.post("/:id/insights", protect, generateInsights);

// module.exports = router;



// In your dataRoutes.js or similar file
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { 
    getUserAnalyses, 
    getAnalysis, 
    getAnalysisData,
    generateInsights,
    saveChartConfig,
    getUserStats
} = require("../controllers/dataController");

router.get("/stats", protect, getUserStats);


router.get("/history", protect, getUserAnalyses);



router.get("/:id", protect, getAnalysis);
router.get("/:id/data", protect, getAnalysisData);
router.post("/:id/insights", protect, generateInsights);
// router.put("/:id/chart", protect, saveChartConfig);]
router.put('/:id/chart', protect, saveChartConfig);

module.exports = router;
