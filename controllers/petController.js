const Pet = require("../models/pet");
const User = require("../models/user");
const mongoose = require("mongoose");

// Add a new pet
exports.addPet = async (req, res) => {
    try {
        const { owner_id, species, gender, name, breed, dob } = req.body;

        // Validate owner_id format before querying DB
        if (!mongoose.Types.ObjectId.isValid(owner_id)) {
            return res.status(400).json({ error: "Invalid owner ID format." });
        }

        // Create the pet entry first
        const pet = new Pet({ owner_id, species, gender, name, breed, dob });

        // Use findByIdAndUpdate to update in one step
        const user = await User.findByIdAndUpdate(
            owner_id,
            { $push: { pets: pet._id } }, // Directly push new pet
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found. Cannot add pet." });
        }

        // Save pet after ensuring user exists
        await pet.save();

        res.status(201).json({ message: "Pet added successfully", pet_id: pet._id });
    } catch (error) {
        console.error("Error adding pet:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Invalid pet data provided." });
        }
        
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

// Get all pets or a specific pet by ID
exports.getPets = async (req, res) => {
    try {
        const { pet_id } = req.query;

        let pets;
        if (pet_id) {
            if (!mongoose.Types.ObjectId.isValid(pet_id)) {
                return res.status(400).json({ error: "Invalid pet ID format." });
            }

            pets = await Pet.findById(pet_id).populate("owner_id", "name phone_number");
            if (!pets) return res.status(404).json({ error: "Pet not found." });
        } else {
            pets = await Pet.find().populate("owner_id", "name phone_number");
        }

        res.status(200).json(pets);
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ error: "Internal server error while fetching pets." });
    }
};
