const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    verified: { type: Boolean, default: true },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
});

module.exports = mongoose.model("User", UserSchema);
