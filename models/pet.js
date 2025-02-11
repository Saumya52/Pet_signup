const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    species: { type: String, required: true },
    gender: { type: String, required: true },
    name: { type: String, required: true },
    breed: { type: String, required: true },
    dob: { type: String, required: true },
});

module.exports = mongoose.model("Pet", PetSchema);
