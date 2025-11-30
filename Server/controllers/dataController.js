



const Analysis = require("../models/Analysis");
const fs = require("fs");
const path = require("path");

// Safely require OpenAI config
let openai;
try {
  openai = require("../config/openai");
} catch (error) {
  console.error("Error loading OpenAI configuration:", error.message);
  openai = null;
}

// Get all analyses for the logged-in user
// exports.getUserAnalyses = async (req, res) => {
//   try {
//     const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
//     res.json(analyses);
//   } catch (error) {
//     res.status(500).json({ message: "Server error: " + error.message });
//   }
// };


// exports.getUserAnalyses = async (req, res) => {
//   try {
//     const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
//     console.log('DB Query Result:', analyses.map(a => ({ id: a._id, hasChartConfig: !!a.chartConfig })));  // Log with chartConfig presence
//     res.json(analyses);
//   } catch (error) {
//     console.error('DB Fetch Error:', error);  // This would show if auth/DB issue
//     res.status(500).json({ message: "Server error: " + error.message });
//   }
// };

exports.getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log(`✅ Fetched ${analyses.length} analyses for user ${req.user._id}`);
    res.json(analyses);
  } catch (error) {
    console.error('❌ DB Fetch Error:', error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};



// Get specific analysis by ID
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    if (analysis.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};



// // ✅ Save chart configuration
// exports.saveChartConfig = async (req, res) => {
//   try {
//     // req.body is already the full chartConfig object: { chartType, xAxis, yAxis, title }
//     const chartConfig = req.body;  // No destructuring needed

//     const analysis = await Analysis.findById(req.params.id);
//     if (!analysis) return res.status(404).json({ message: "Analysis not found" });

//     if (analysis.userId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // Save full config (overwrites individual fields for consistency)
//     analysis.chartConfig = chartConfig;
//     analysis.chartType = chartConfig.chartType;
//     analysis.xAxis = chartConfig.xAxis;
//     analysis.yAxis = chartConfig.yAxis;

//     // Handle summary if passed (for backward compat)
//     if (chartConfig.summary) analysis.summary = chartConfig.summary;

//     await analysis.save();
//     res.json(analysis);  // Now includes chartConfig
//   } catch (error) {
//     res.status(500).json({ message: "Server error: " + error.message });
//   }
// };




// Get paginated data for an analysis
exports.getAnalysisData = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const analysis = await Analysis.findById(id);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    if (analysis.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let filePath;
    if (analysis.filePath) {
      filePath = analysis.filePath;
    } else if (analysis.filename) {
      filePath = path.join(__dirname, "../uploads", analysis.filename);
    } else {
      filePath = path.join(__dirname, "../uploads", `${id}.json`);
    }

    console.log("Attempting to read file from:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);
      return res.status(404).json({ message: "Data file not found" });
    }

    const dataFile = fs.readFileSync(filePath, "utf8");
    const allData = JSON.parse(dataFile);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = allData.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      currentPage: page,
      totalPages: Math.ceil(allData.length / limit),
      totalRows: allData.length,
      columns: analysis.columns,
    });
  } catch (error) {
    console.error("Get data error:", error);
    res.status(500).json({ message: "Error retrieving data: " + error.message });
  }
};

// Helper function to get file path safely
function getFilePath(analysis) {
  if (analysis.filePath) {
    return analysis.filePath;
  } else if (analysis.filename) {
    return path.join(__dirname, "../uploads", analysis.filename);
  } else {
    return path.join(__dirname, "../uploads", `${analysis._id}.json`);
  }
}

// Helper: Basic fallback insights generator
function generateBasicInsights(data, columns, rowCount, chartConfig = null) {
  const insights = [];
  insights.push(`📊 **Dataset Overview**`);
  insights.push(`- Total records: ${rowCount}`);
  insights.push(`- Columns: ${columns.join(", ")}`);

  if (chartConfig && chartConfig.xAxis && chartConfig.yAxis) {
    insights.push(`\n📈 **Chart Analysis**`);
    insights.push(`- Chart Type: ${chartConfig.chartType || "Not specified"}`);
    insights.push(`- X-Axis: ${chartConfig.xAxis}`);
    insights.push(`- Y-Axis: ${chartConfig.yAxis}`);

    const xValues = data.map(r => r[chartConfig.xAxis]).filter(v => v !== undefined && v !== null);
    const yValues = data.map(r => parseFloat(r[chartConfig.yAxis])).filter(v => !isNaN(v));

    if (yValues.length > 0) {
      const sum = yValues.reduce((a, b) => a + b, 0);
      const avg = sum / yValues.length;
      const max = Math.max(...yValues);
      const min = Math.min(...yValues);

      insights.push(`\n**${chartConfig.yAxis} Statistics:**`);
      insights.push(`- Average: ${avg.toFixed(2)}`);
      insights.push(`- Maximum: ${max}`);
      insights.push(`- Minimum: ${min}`);
      insights.push(`- Range: ${(max - min).toFixed(2)}`);
    }
  }

  insights.push(`\n💡 **Recommendations**`);
  insights.push(`- Visualize your data to uncover trends.`);
  insights.push(`- Review top-performing areas for insights.`);
  insights.push(`- Check for anomalies or missing values.`);
  insights.push(`- Ensure OpenAI API key is configured for AI insights.`);
  return insights.join("\n");
}

// ✅ Generate AI insights for an analysis
exports.generateInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const chartConfig = req.body.chartConfig || null;

    const analysis = await Analysis.findById(id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });

    if (analysis.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const filePath = getFilePath(analysis);
    console.log("Reading data from:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Data file not found",
        insights: "Unable to generate insights - data file missing",
      });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const effectiveChartConfig = chartConfig || {
      chartType: analysis.chartType,
      xAxis: analysis.xAxis,
      yAxis: analysis.yAxis,
  
    };

    if (!process.env.OPENAI_API_KEY || !openai) {
      console.log("OpenAI key missing — using fallback insights");
      const insights = generateBasicInsights(data, analysis.columns, analysis.rowCount, effectiveChartConfig);
      analysis.summary = insights;
      await analysis.save();
      return res.json({ insights, isFallback: true, message: "Fallback (no API key)" });
    }

    const sampleData = data.slice(0, 20);
    console.log("Calling OpenAI API with sample size:", sampleData.length);

    const prompt =
      effectiveChartConfig.xAxis && effectiveChartConfig.yAxis
        ? `
        Analyze this chart visualization and provide actionable business insights:
        Chart Type: ${effectiveChartConfig.chartType || "Bar/Line Chart"}
        X-Axis: ${effectiveChartConfig.xAxis}
        Y-Axis: ${effectiveChartConfig.yAxis}
        Total Records: ${analysis.rowCount}
        Sample Data: ${JSON.stringify(sampleData)}
        Provide concise business insights (4–5 bullet points).
      `
        : `
        Analyze this dataset and provide key business insights:
        Columns: ${analysis.columns.join(", ")}
        Total Records: ${analysis.rowCount}
        Sample Data: ${JSON.stringify(sampleData)}
        Provide concise, actionable observations (4–5 bullet points).
      `;

    // Retry wrapper for OpenAI API
    async function callOpenAIWithRetry(retries = 3, delay = 5000) {
      try {
        return await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a business data analyst. Provide concise, bullet-point insights from data visualizations.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 700,
          temperature: 0.7,
        });
      } catch (err) {
        if (err.status === 429 && retries > 0) {
          console.warn(`⚠️ Rate limit hit. Retrying in ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
          return callOpenAIWithRetry(retries - 1, delay * 2);
        }
        throw err;
      }
    }

    const response = await callOpenAIWithRetry();
    const insights = response.choices[0].message.content;

    analysis.summary = insights;
    await analysis.save();

    console.log("✅ AI insights generated successfully");
    res.json({ insights, isFallback: false, message: "AI insights generated successfully" });
  } catch (error) {
    console.error("❌ Error generating insights:", error.message);

    let errorMessage = "Error generating insights";
    if (error.status === 429) errorMessage = "OpenAI quota exceeded. Using fallback insights.";
    else if (error.status === 401) errorMessage = "Invalid API key. Using fallback insights.";

    // Try fallback
    try {
      const analysis = await Analysis.findById(req.params.id);
      if (analysis) {
        const filePath = getFilePath(analysis);
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
          const chartConfig = req.body.chartConfig || {
            chartType: analysis.chartType,
            xAxis: analysis.xAxis,
            yAxis: analysis.yAxis,
          };
          const fallbackInsights = generateBasicInsights(data, analysis.columns, analysis.rowCount, chartConfig);
          analysis.summary = fallbackInsights;
          await analysis.save();

          return res.json({
            insights: fallbackInsights,
            isFallback: true,
            message: errorMessage,
          });
        }
      }
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError.message);
    }

    res.status(500).json({
      message: errorMessage,
      insights: "Unable to generate insights at this time.",
    });
  }
};

// exports.getUserStats = async (req, res) => {
//     try {
//         const userId = req.user._id;
        
//         // Get all analyses for the user
//         const analyses = await Analysis.find({ user: userId });
        
//         // Calculate stats
//         const stats = {
//             totalAnalyses: analyses.length,
            
//             // Count only analyses with saved chartConfig
//             chartsGenerated: analyses.filter(analysis =>
//                 analysis.chartConfig &&
//                 analysis.chartConfig.xAxis &&
//                 analysis.chartConfig.yAxis
//             ).length,
            
//             // Count analyses with AI-generated insights/summary
//             aiInsights: analyses.filter(analysis =>
//                 analysis.summary && analysis.summary.trim().length > 0
//             ).length,
            
//             // Always 1 or 0 (current active analysis)
//             activeAnalysis: 1 // This is handled in frontend with currentAnalysis
//         };
        
//         res.json(stats);
//     } catch (error) {
//         res.status(500).json({
//             message: "Error fetching user stats",
//             error: error.message
//         });
//     }
// };



exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get all analyses for the user
        const analyses = await Analysis.find({ userId: userId });
        
        
        // Calculate stats
        const stats = {
            totalAnalyses: analyses.length,
            
            // Count only analyses with saved chartConfig that has both axes defined
            chartsGenerated: analyses.filter(analysis => 
                analysis.chartConfig && 
                analysis.chartConfig.xAxis && 
                analysis.chartConfig.yAxis
            ).length,
            
            // Count analyses with AI-generated insights/summary
            aiInsights: analyses.filter(analysis => 
                analysis.summary && analysis.summary.trim().length > 0
            ).length,
            
            // Always 1 or 0 (current active analysis)
            activeAnalysis: 1 // This is handled in frontend with currentAnalysis
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching user stats", 
            error: error.message 
        });
    }
};




// ✅ Save chart configuration with charts generated count



// In datacontroller.js - use saveChartConfig (not saveChartConfiguration)
exports.saveChartConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const chartConfig = req.body;
        
        const analysis = await Analysis.findOne({ 
            _id: id, 
            userId: req.user._id 
        });
        
        if (!analysis) {
            return res.status(404).json({ message: "Analysis not found" });
        }
        
        // Check if this is a new chart (no previous chartConfig)
        const isNewChart = !analysis.chartConfig || 
                          !analysis.chartConfig.xAxis || 
                          !analysis.chartConfig.yAxis;
        
        // Update the chart configuration
        analysis.chartConfig = chartConfig;
        analysis.updatedAt = Date.now();
        await analysis.save();
        
        res.json({ 
            message: "Chart configuration saved successfully",
            isNewChart,
            analysis 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error saving chart configuration", 
            error: error.message 
        });
    }
};







