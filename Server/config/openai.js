
// server/config/openai.js

const OpenAI = require("openai");
require("dotenv").config();

if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY environment variable is not set. AI insights will use fallback mode.");
    module.exports = null;
} else {
    console.log("✅ OpenAI API key is configured");

    // Create OpenAI client instance
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    module.exports = openai;
}




