

// const Analysis = require("../models/Analysis");
// const fs = require("fs");
// const path = require("path");

// // Safely require openai config
// let openai;
// try {
//     openai = require("../config/openai");
// } catch (error) {
//     console.error("Error loading OpenAI configuration:", error.message);
//     openai = null;
// }

// // Get all analyses for the logged-in user
// exports.getUserAnalyses = async (req, res) => {
//     try {
//         const analyses = await Analysis.find({userId: req.user._id}).sort({createdAt: -1});
//         res.json(analyses);
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Get specific analysis by ID
// exports.getAnalysis = async (req, res) => {
//     try {
//         const analysis = await Analysis.findById(req.params.id);

//         if (!analysis) {
//             return res.status(404).json({message: "Analysis not found"});
//         }

//         // Check if the analysis belongs to the user
//         if (analysis.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
//             return res.status(403).json({message: "Not authorized"});
//         }

//         res.json(analysis);
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Get paginated data for an analysis
// exports.getAnalysisData = async (req, res) => {
//     try {
//         const {id} = req.params;
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         const analysis = await Analysis.findById(id);
//         if (!analysis) {
//             return res.status(404).json({message: "Analysis not found"});
//         }

//         // Check if user owns this analysis
//         if (analysis.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
//             return res.status(403).json({message: "Not authorized"});
//         }

//         // Construct file path
//         let filePath;
        
//         if (analysis.filePath) {
//             filePath = analysis.filePath;
//         } else if (analysis.filename) {
//             filePath = path.join(__dirname, '../uploads', analysis.filename);
//         } else {
//             filePath = path.join(__dirname, '../uploads', `${id}.json`);
//         }

//         console.log("Attempting to read file from:", filePath);

//         // Check if file exists
//         if (!fs.existsSync(filePath)) {
//             console.error("File not found at path:", filePath);
//             return res.status(404).json({message: "Data file not found"});
//         }

//         // Read data from file
//         const dataFile = fs.readFileSync(filePath, "utf8");
//         const allData = JSON.parse(dataFile);

//         // Calculate pagination
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;
//         const paginatedData = allData.slice(startIndex, endIndex);

//         res.json({
//             data: paginatedData,
//             currentPage: page,
//             totalPages: Math.ceil(allData.length / limit),
//             totalRows: allData.length,
//             columns: analysis.columns,
//         });
//     } catch (error) {
//         console.error("Get data error:", error);
//         res.status(500).json({message: "Error retrieving data: " + error.message});
//     }
// };

// // Helper function to get file path safely
// function getFilePath(analysis) {
//     if (analysis.filePath) {
//         return analysis.filePath;
//     } else if (analysis.filename) {
//         return path.join(__dirname, '../uploads', analysis.filename);
//     } else {
//         return path.join(__dirname, '../uploads', `${analysis._id}.json`);
//     }
// }

// // Helper function to generate basic insights with chart context
// function generateBasicInsights(data, columns, rowCount, chartConfig = null) {
//     const insights = [];
    
//     insights.push(`📊 **Dataset Overview**`);
//     insights.push(`- Total records: ${rowCount}`);
//     insights.push(`- Columns: ${columns.join(', ')}`);
    
//     // If chart configuration exists, analyze it
//     if (chartConfig && chartConfig.xAxis && chartConfig.yAxis) {
//         insights.push(`\n📈 **Chart Analysis**`);
//         insights.push(`- Chart Type: ${chartConfig.chartType || 'Not specified'}`);
//         insights.push(`- X-Axis: ${chartConfig.xAxis}`);
//         insights.push(`- Y-Axis: ${chartConfig.yAxis}`);
        
//         // Analyze the relationship between X and Y axis
//         const xValues = data.map(row => row[chartConfig.xAxis]).filter(val => val !== undefined && val !== null);
//         const yValues = data.map(row => parseFloat(row[chartConfig.yAxis])).filter(val => !isNaN(val));
        
//         if (yValues.length > 0) {
//             const sum = yValues.reduce((a, b) => a + b, 0);
//             const avg = sum / yValues.length;
//             const max = Math.max(...yValues);
//             const min = Math.min(...yValues);
            
//             insights.push(`\n**${chartConfig.yAxis} Statistics:**`);
//             insights.push(`- Average: ${avg.toFixed(2)}`);
//             insights.push(`- Maximum: ${max}`);
//             insights.push(`- Minimum: ${min}`);
//             insights.push(`- Range: ${(max - min).toFixed(2)}`);
            
//             // Find top performers
//             const sortedData = [...data]
//                 .map(row => ({x: row[chartConfig.xAxis], y: parseFloat(row[chartConfig.yAxis])}))
//                 .filter(item => !isNaN(item.y))
//                 .sort((a, b) => b.y - a.y);
            
//             if (sortedData.length > 0) {
//                 insights.push(`\n**Top 3 by ${chartConfig.yAxis}:**`);
//                 sortedData.slice(0, 3).forEach((item, idx) => {
//                     insights.push(`${idx + 1}. ${item.x}: ${item.y}`);
//                 });
//             }
//         }
//     }
    
//     // Basic statistical insights for numeric columns
//     const numericColumns = columns.filter(col => {
//         return data.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]));
//     });
    
//     if (numericColumns.length > 0 && !chartConfig) {
//         insights.push(`\n📈 **Numeric Analysis**`);
        
//         numericColumns.slice(0, 5).forEach(col => {
//             const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
//             if (values.length > 0) {
//                 const sum = values.reduce((a, b) => a + b, 0);
//                 const avg = sum / values.length;
//                 const max = Math.max(...values);
//                 const min = Math.min(...values);
                
//                 insights.push(`- **${col}**: Avg ${avg.toFixed(2)}, Range ${min}-${max}`);
//             }
//         });
//     }
    
//     // Check for categorical columns
//     const categoricalColumns = columns.filter(col => {
//         return !numericColumns.includes(col) && data.some(row => row[col] && typeof row[col] === 'string');
//     });
    
//     if (categoricalColumns.length > 0 && !chartConfig) {
//         insights.push(`\n📋 **Categorical Data**`);
//         categoricalColumns.slice(0, 3).forEach(col => {
//             const uniqueValues = [...new Set(data.map(row => row[col]).filter(val => val))];
//             if (uniqueValues.length > 0) {
//                 insights.push(`- **${col}**: ${uniqueValues.length} unique values`);
//             }
//         });
//     }
    
//     insights.push(`\n💡 **Recommendations**`);
//     if (chartConfig) {
//         insights.push(`- Focus on top-performing categories for best results`);
//         insights.push(`- Investigate low-performing areas for improvement opportunities`);
//         insights.push(`- Monitor trends over time to identify patterns`);
//     } else {
//         insights.push(`- Create visualizations to better understand data relationships`);
//         insights.push(`- Select X and Y axes to generate chart-specific insights`);
//     }
//     insights.push(`- For AI-powered insights, ensure your OpenAI API key has credits`);
    
//     return insights.join('\n');
// }

// // // Generate AI insights for an analysis
// exports.generateInsights = async (req, res) => {
//     try {
//         const {id} = req.params;
        
//         // Get chart configuration from request body if provided
//         const chartConfig = req.body.chartConfig || null;
        
//         const analysis = await Analysis.findById(id);
//         if (!analysis) {
//             return res.status(404).json({message: "Analysis not found"});
//         }

//         // Check if user owns this analysis
//         if (analysis.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
//             return res.status(403).json({message: "Not authorized"});
//         }

//         // Get file path using helper function
//         const filePath = getFilePath(analysis);
        
//         console.log("Reading data from:", filePath);

//         // Check if file exists
//         if (!fs.existsSync(filePath)) {
//             return res.status(404).json({
//                 message: "Data file not found",
//                 insights: "Unable to generate insights - data file missing"
//             });
//         }

//         // Read data from file
//         const dataFile = fs.readFileSync(filePath, "utf8");
//         const data = JSON.parse(dataFile);

//         // Use chart config from analysis if not provided in request
//         const effectiveChartConfig = chartConfig || {
//             chartType: analysis.chartType,
//             xAxis: analysis.xAxis,
//             yAxis: analysis.yAxis
//         };

//         // Check if OpenAI API key is configured
//         if (!process.env.OPENAI_API_KEY || !openai) {
//             console.log("OpenAI API key not configured or module not loaded, using basic insights");
            
//             const insights = generateBasicInsights(data, analysis.columns, analysis.rowCount, effectiveChartConfig);
            
//             analysis.summary = insights;
//             await analysis.save();
            
//             return res.json({
//                 insights,
//                 isFallback: true,
//                 message: "Using statistical analysis (OpenAI API key not configured)"
//             });
//         }

//         // Use a sample of data for analysis
//         const sampleData = data.slice(0, 20);
        
//         console.log("Calling OpenAI API with sample size:", sampleData.length);

//         // Build prompt based on whether chart config is provided
//         let prompt;
        
//         if (effectiveChartConfig.xAxis && effectiveChartConfig.yAxis) {
//             // Chart-specific insights
//             prompt = `
//                 Analyze this chart visualization and provide actionable business insights:
                
//                 **Chart Details:**
//                 - Chart Type: ${effectiveChartConfig.chartType || 'Bar/Line Chart'}
//                 - X-Axis (${effectiveChartConfig.xAxis}): Categories or time periods
//                 - Y-Axis (${effectiveChartConfig.yAxis}): Measured values
                
//                 **Dataset:**
//                 - Total Records: ${analysis.rowCount}
//                 - Sample Data: ${JSON.stringify(sampleData)}
                
//                 Please provide:
//                 1. **Key Observation**: What is the main story this chart tells?
//                 2. **Trend Analysis**: Identify patterns, trends, or anomalies in the ${effectiveChartConfig.yAxis} across ${effectiveChartConfig.xAxis}
//                 3. **Top Performers**: Which categories/periods show the best performance?
//                 4. **Areas of Concern**: Which categories/periods need attention?
//                 5. **Business Recommendation**: One specific action to improve results
                
//                 Keep the response concise (4-5 bullet points) and business-focused.
//             `;
//         } else {
//             // General dataset insights
//             prompt = `
//                 Analyze this dataset and provide key business insights:
                
//                 **Dataset:**
//                 - Columns: ${analysis.columns.join(", ")}
//                 - Total Records: ${analysis.rowCount}
//                 - Sample Data: ${JSON.stringify(sampleData)}
                
//                 Provide:
//                 1. Dataset overview and key patterns
//                 2. Notable correlations or relationships
//                 3. Business opportunities identified
//                 4. Specific recommendation for next steps
                
//                 Keep response concise and actionable (4-5 bullet points).
//             `;
//         }

//         // Call OpenAI API
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a business data analyst providing concise, actionable insights from data visualizations. Use clear bullet points and focus on business value."
//                 },
//                 { role: "user", content: prompt }
//             ],
//             max_tokens: 700,
//             temperature: 0.7,
//         });

//         const insights = response.choices[0].message.content;

//         // Save insights to analysis
//         analysis.summary = insights;
//         await analysis.save();

//         console.log("Successfully generated AI insights");
//         res.json({
//             insights,
//             isFallback: false,
//             message: "AI-powered chart insights generated successfully"
//         });

//     } catch (error) {
//         console.error("Error generating insights:", error.message);
        
//         let errorMessage = "Error generating insights";
//         let fallbackInsights = "";
        
//         try {
//             const analysis = await Analysis.findById(req.params.id);
            
//             if (error.response) {
//                 const status = error.response.status;
                
//                 console.error(`OpenAI API Error ${status}:`, error.response.data);
                
//                 if (status === 429) {
//                     errorMessage = "OpenAI API rate limit exceeded. Using statistical analysis instead.";
//                 } else if (status === 401) {
//                     errorMessage = "Invalid OpenAI API key. Using statistical analysis instead.";
//                 } else if (status === 403) {
//                     errorMessage = "OpenAI API access forbidden. Using statistical analysis instead.";
//                 } else {
//                     errorMessage = `OpenAI API error. Using statistical analysis instead.`;
//                 }
//             } else if (error.request) {
//                 errorMessage = "No response from OpenAI API. Using statistical analysis instead.";
//             } else {
//                 errorMessage = error.message;
//             }
            
//             // Generate meaningful fallback insights
//             if (analysis) {
//                 const filePath = getFilePath(analysis);
                
//                 if (fs.existsSync(filePath)) {
//                     const dataFile = fs.readFileSync(filePath, "utf8");
//                     const data = JSON.parse(dataFile);
                    
//                     // Get chart config from request or analysis
//                     const chartConfig = req.body.chartConfig || {
//                         chartType: analysis.chartType,
//                         xAxis: analysis.xAxis,
//                         yAxis: analysis.yAxis
//                     };
                    
//                     fallbackInsights = generateBasicInsights(data, analysis.columns, analysis.rowCount, chartConfig);
                    
//                     analysis.summary = fallbackInsights;
//                     await analysis.save();
                    
//                     // Return success with fallback insights
//                     return res.json({
//                         insights: fallbackInsights,
//                         isFallback: true,
//                         message: errorMessage
//                     });
//                 } else {
//                     return res.status(404).json({
//                         message: "Data file not found",
//                         insights: "Unable to generate insights"
//                     });
//                 }
//             }
//         } catch (fallbackError) {
//             console.error("Error generating fallback insights:", fallbackError);
//         }
        
//         // If everything fails, return error
//         res.status(500).json({
//             message: errorMessage,
//             insights: fallbackInsights || "Unable to generate insights at this time."
//         });
//     }
// };





// // Save chart configuration
//     exports.saveChartConfig = async (req, res) => {
//         try {
//             const { chartType, xAxis, yAxis, summary } = req.body;

//             const analysis = await Analysis.findById(req.params.id);

//             if (!analysis) {
//                 return res.status(404).json({ message: "Analysis not found" });
//             }

//             // Check if the analysis belongs to the user
//             if (analysis.userId.toString() !== req.user._id.toString()) {
//                 return res.status(403).json({ message: "Not authorized" });
//             }

//             analysis.chartType = chartType;
//             analysis.xAxis = xAxis;
//             analysis.yAxis = yAxis;
//             if (summary) {
//                 analysis.summary = summary;
//             }

//             await analysis.save();

//             res.json(analysis);
//         } catch (error) {
//             res.status(500).json({ message: "Server error: " + error.message });
//         }
//     }





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


exports.getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log('DB Query Result:', analyses.map(a => ({ id: a._id, hasChartConfig: !!a.chartConfig })));  // Log with chartConfig presence
    res.json(analyses);
  } catch (error) {
    console.error('DB Fetch Error:', error);  // This would show if auth/DB issue
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
        const analyses = await Analysis.find({ user: userId });
        
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







