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
