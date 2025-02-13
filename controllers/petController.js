const Pet = require("../models/pet");
const User = require("../models/user");

exports.addPet = async (req, res) => {
    try {
        const { owner_id, species, gender, name, breed, dob } = req.body;
        const user = await User.findById(owner_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const pet = new Pet({ owner_id, species, gender, name, breed, dob });
        await pet.save();

        user.pets.push(pet._id);
        await user.save();

        res.status(201).json({ message: "Pet added successfully", pet_id: pet._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPets = async (req, res) => {
    try {
        const { pet_id } = req.query;

        let pets;
        if (pet_id) {
            pets = await Pet.findById(pet_id).populate("owner_id", "name phone_number");
            if (!pets) return res.status(404).json({ message: "Pet not found" });
        } else {
            pets = await Pet.find().populate("owner_id", "name phone_number");
        }

        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pets", error: error.message });
    }
};