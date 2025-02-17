const User = require("../models/user");
const mongoose = require("mongoose");

// Signup a New User
exports.signupUser = async (req, res) => {
    try {
        const { name, phone_number } = req.body;

        //  Validate input fields (Check missing fields)
        if (!name || !phone_number) {
            return res.status(400).json({ error: "Both name and phone number are required." });
        }

        // 2️ Check for invalid name format (Only alphabets and spaces, min 3 chars)
        const nameRegex = /^[A-Za-z\s]{3,}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ error: "Invalid name format. Must contain only alphabets and be at least 3 characters long." });
        }

        // 3️ Validate phone number format (Must be 10-digit numeric)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone_number)) {
            return res.status(400).json({ error: "Invalid phone number format. Must be exactly 10 digits." });
        }

        // 4️ Check if phone number already exists (Avoid duplicate accounts)
        const existingUser = await User.findOne({ phone_number });
        if (existingUser) {
            return res.status(409).json({ error: "Phone number already exists. Please use a different one." });
        }

        // 5️ Create and save new user
        const newUser = new User({ name, phone_number, pets: [] });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user_id: newUser._id,
        });

    } catch (error) {
        console.error("Error signing up user:", error);

        // Handle MongoDB errors
        if (error.name === "MongoServerError" && error.code === 11000) {
            return res.status(409).json({ error: "Duplicate phone number. Please use a different number." });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Invalid input data. Check your request body." });
        }

        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

// Get All Users or a Specific User by ID
exports.getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user_id format
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: "Invalid user ID format." });
        }

        const user = await User.findById(user_id).populate("pets");

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal server error while fetching user by ID." });
    }
};

// Fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("pets");

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found in the system." });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: "Internal server error while fetching users." });
    }
};