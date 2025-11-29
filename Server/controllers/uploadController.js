const Analysis = require("../models/Analysis");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Upload and parse Excel file
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "Please upload a file"});
        }

        // Parse Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Extract column headers
        const columns = [];
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({r: range.s.r, c: C})];
            if (cell && cell.v) columns.push(cell.v);
        }

        // Save processed data to a JSON file instead of storing in MongoDB
        const dataFilePath = path.join("uploads", `${req.file.filename}_data.json`);
        fs.writeFileSync(dataFilePath, JSON.stringify(data));

        // Save to database
        const analysis = await Analysis.create({
            userId: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: dataFilePath,
            columns: columns,
            rowCount: data.length,
        });

        // Clean up the original Excel file
        fs.unlinkSync(req.file.path);

        res.json({
            message: "File uploaded successfully",
            columns: columns,
            rowCount: data.length,
            analysisId: analysis._id,
        });
    } catch (error) {
        console.error("Upload error:", error);
        // Clean up any files on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({message: "Error processing file: " + error.message});
    }
};
