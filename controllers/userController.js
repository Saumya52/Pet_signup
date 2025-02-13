const User = require("../models/user");

exports.signupUser = async (req, res) => {
    try {
        const { name, phone_number } = req.body;
        const newUser = new User({ name, phone_number, pets: [] });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user_id: newUser._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate("pets"); // Populate pets data
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};