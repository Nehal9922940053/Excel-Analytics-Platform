const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Allow only Excel files
    if (
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only Excel files are allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

module.exports = upload;
