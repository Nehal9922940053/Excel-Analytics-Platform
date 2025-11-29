const mongoose = require('mongoose');
const Analysis = require('./models/Analysis');  // Points to Server/models/Analysis.js

// Connect to your DB (pulls from .env or fallback)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb')
  .then(() => console.log('Connected to MongoDB for migration'))
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });

async function migrate() {
  try {
    // Find analyses without chartConfig but with partial chart data
    const analyses = await Analysis.find({ 
      chartConfig: { $exists: false }, 
      $or: [{ chartType: { $exists: true } }, { xAxis: { $exists: true } }] 
    });
    console.log(`Migrating ${analyses.length} analyses...`);

    for (const analysis of analyses) {
      analysis.chartConfig = {
        chartType: analysis.chartType,
        xAxis: analysis.xAxis,
        yAxis: analysis.yAxis,
        title: analysis.title || '',  // Fallback if no title field exists yet
      };
      await analysis.save();
      console.log(`Migrated ${analysis._id}`);
    }
    console.log('Migration done!');
  } catch (error) {
    console.error('Migration Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

migrate();