const Pet = require("../models/pet");
const User = require("../models/user");
const mongoose = require("mongoose");

// Utility function to validate pet input
function validatePetInput(data) {
  const { owner_id, species, gender, name, breed, dob } = data;

  // Check that all required fields are provided
  if (!owner_id || !species || !gender || !name || !breed || !dob) {
    return "All pet fields (owner_id, species, gender, name, breed, dob) are required.";
  }

  // Validate owner_id format
  if (!mongoose.Types.ObjectId.isValid(owner_id)) {
    return "Invalid owner ID format.";
  }

  // Validate species (only allow specific types, e.g., Dog, Cat)
  const allowedSpecies = ["Dog", "Cat"];
  if (!allowedSpecies.includes(species)) {
    return `Species must be one of the following: ${allowedSpecies.join(", ")}.`;
  }

  // Validate gender (only allow 'Male' or 'Female')
  const allowedGenders = ["Male", "Female"];
  if (!allowedGenders.includes(gender)) {
    return "Gender must be either 'Male' or 'Female'.";
  }

  // Validate pet name (at least 2 characters)
  if (name.trim().length < 2) {
    return "Pet name must be at least 2 characters long.";
  }

  // Validate date format for dob (expecting YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return "Date of birth must be in the format YYYY-MM-DD.";
  }

  return null; // No errors
}

//  Add a New Pet
exports.addPet = async (req, res) => {
  try {
    const { owner_id, species, gender, name, breed, dob } = req.body;

    // Validate pet input
    const errorMessage = validatePetInput(req.body);
    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    // Create a new pet instance
    const pet = new Pet({ owner_id, species, gender, name, breed, dob });
    await pet.save();

    // Update the user's pets list in a single query
    const updatedUser = await User.findByIdAndUpdate(
      owner_id,
      { $push: { pets: pet._id } },
      { new: true }
    );

    // If the user doesn't exist, remove the pet that was just created
    if (!updatedUser) {
      await Pet.findByIdAndDelete(pet._id);
      return res.status(404).json({ error: "User not found. Pet could not be added." });
    }

    res.status(201).json({ message: "Pet added successfully", pet_id: pet._id });
  } catch (error) {
    console.error("Error adding pet:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid pet data provided." });
    }

    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};

//  Get Pets (All or by ID)
exports.getPets = async (req, res) => {
  try {
    const { pet_id } = req.query;
    let pets;

    if (pet_id) {
      // Validate pet_id format
      if (!mongoose.Types.ObjectId.isValid(pet_id)) {
        return res.status(400).json({ error: "Invalid pet ID format." });
      }

      pets = await Pet.findById(pet_id).populate("owner_id", "name phone_number");
      if (!pets) {
        return res.status(404).json({ error: "Pet not found." });
      }
    } else {
      pets = await Pet.find().populate("owner_id", "name phone_number");
      if (!pets || (Array.isArray(pets) && pets.length === 0)) {
        return res.status(404).json({ error: "No pets found in the system." });
      }
    }

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid query parameter format." });
    }

    res.status(500).json({ error: "Internal server error while fetching pets." });
  }
};

exports.getPetsByOwner = async (req, res) => {
    try {
      const { owner_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(owner_id)) {
        return res.status(400).json({ error: "Invalid owner ID format." });
      }
      const pets = await Pet.find({ owner_id }).populate("owner_id", "name phone_number");
      if (!pets || pets.length === 0) {
        return res.status(404).json({ error: "No pets found for this owner." });
      }
      res.status(200).json(pets);
    } catch (error) {
      console.error("Error fetching pets by owner:", error);
      res.status(500).json({ error: "Internal server error while fetching pets by owner." });
    }
  };
  
  //  Search Pets by Various Criteria
  exports.searchPets = async (req, res) => {
    try {
      // Extract search parameters (name, species, gender, breed, dob)
      const { name, species, gender, breed, dob } = req.query;
      let filter = {};
      if (name) filter.name = { $regex: name, $options: "i" }; // case-insensitive search
      if (species) filter.species = species;
      if (gender) filter.gender = gender;
      if (breed) filter.breed = { $regex: breed, $options: "i" };
      if (dob) filter.dob = dob;
      const pets = await Pet.find(filter).populate("owner_id", "name phone_number");
      if (!pets || pets.length === 0) {
        return res.status(404).json({ error: "No pets found matching the criteria." });
      }
      res.status(200).json(pets);
    } catch (error) {
      console.error("Error searching pets:", error);
      res.status(500).json({ error: "Internal server error while searching for pets." });
    }
  };
