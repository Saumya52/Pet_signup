const User = require("../models/user");
const mongoose = require("mongoose");

// ✅ Signup a New User
exports.signupUser = async (req, res) => {
    try {
        const { name, phone_number } = req.body;

        // Validate input fields
        if (!name || !phone_number) {
            return res.status(400).json({ error: "Name and phone number are required." });
        }

        // Check if phone number is valid (basic check)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone_number)) {
            return res.status(400).json({ error: "Invalid phone number format. Must be 10 digits." });
        }

        // Create and save new user
        const newUser = new User({ name, phone_number, pets: [] });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user_id: newUser._id,
        });
    } catch (error) {
        console.error("Error signing up user:", error);

        if (error.code === 11000) {
            return res.status(400).json({ error: "Phone number already exists. Please use a different one." });
        }

        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

// ✅ Get All Users or a Specific User by ID
exports.getUsers = async (req, res) => {
    try {
        const { user_id } = req.query;

        let users;
        if (user_id) {
            // Validate user_id format before querying
            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ error: "Invalid user ID format." });
            }

            users = await User.findById(user_id).populate("pets");
            if (!users) {
                return res.status(400).json({ error: "User not found." });
            }
        } else {
            users = await User.find().populate("pets");
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error while fetching users." });
    }
};
