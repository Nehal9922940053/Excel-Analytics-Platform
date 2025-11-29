// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// // Hardcoded admin credentials
// const ADMIN_ID = new mongoose.Types.ObjectId();

// const ADMIN_CREDENTIALS = {
//     email: "admin@excelanalytics.com",
//     password: "admin123",
// };

// const generateToken = (id) => {
//     return jwt.sign({id}, process.env.JWT_SECRET, {
//         expiresIn: "30d",
//     });
// };

// // Register new user
// exports.register = async (req, res) => {
//     try {
//         const {email, password} = req.body;

//         // Check if user already exists
//         const userExists = await User.findOne({email});
//         if (userExists) {
//             return res.status(400).json({message: "User already exists"});
//         }

//         // Create user
//         const user = await User.create({
//             email,
//             password,
//         });

//         if (user) {
//             res.status(201).json({
//                 _id: user._id,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 token: generateToken(user._id),
//             });
//         } else {
//             res.status(400).json({message: "Invalid user data"});
//         }
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Login user// Login user
// exports.login = async (req, res) => {
//     try {
//         const {email, password} = req.body;

//         // Check for hardcoded admin
//         if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
//             // Check if admin user exists in database, if not create it
//             let adminUser = await User.findOne({email: ADMIN_CREDENTIALS.email});
            
//             if (!adminUser) {
//                 // Create admin user in database
//                 adminUser = await User.create({
//                     _id: ADMIN_ID,
//                     email: ADMIN_CREDENTIALS.email,
//                     password: ADMIN_CREDENTIALS.password,
//                     isAdmin: true
//                 });
//             }

//             return res.json({
//                 _id: adminUser._id,
//                 email: adminUser.email,
//                 isAdmin: true,
//                 token: generateToken(adminUser._id),
//             });
//         }

//         // Check for regular user
//         const user = await User.findOne({email});

//         if (user && (await user.matchPassword(password))) {
//             res.json({
//                 _id: user._id,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 token: generateToken(user._id),
//             });
//         } else {
//             res.status(401).json({message: "Invalid email or password"});
//         }
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };

// // Get user profile
// exports.getProfile = async (req, res) => {
//     try {
//         res.json({
//             _id: req.user._id,
//             email: req.user.email,
//             isAdmin: req.user.isAdmin,
//         });
//     } catch (error) {
//         res.status(500).json({message: "Server error: " + error.message});
//     }
// };



const mongoose = require("mongoose"); // ADD THIS LINE
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Hardcoded admin credentials
const ADMIN_ID = new mongoose.Types.ObjectId();

const ADMIN_CREDENTIALS = {
    email: "admin@excelanalytics.com",
    password: "admin123",
};

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register new user
exports.register = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user already exists
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        // Create user
        const user = await User.create({
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        res.status(500).json({message: "Server error: " + error.message});
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check for hardcoded admin
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Check if admin user exists in database, if not create it
            let adminUser = await User.findOne({email: ADMIN_CREDENTIALS.email});
            
            if (!adminUser) {
                // Create admin user in database
                adminUser = await User.create({
                    _id: ADMIN_ID,
                    email: ADMIN_CREDENTIALS.email,
                    password: ADMIN_CREDENTIALS.password,
                    isAdmin: true
                });
            }

            return res.json({
                _id: adminUser._id,
                email: adminUser.email,
                isAdmin: true,
                token: generateToken(adminUser._id),
            });
        }

        // Check for regular user
        const user = await User.findOne({email});

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({message: "Invalid email or password"});
        }
    } catch (error) {
        res.status(500).json({message: "Server error: " + error.message});
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        res.json({
            _id: req.user._id,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
        });
    } catch (error) {
        res.status(500).json({message: "Server error: " + error.message});
    }
};