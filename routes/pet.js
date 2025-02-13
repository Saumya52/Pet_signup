const express = require("express");
const { addPet,getPets } = require("../controllers/petController");

const router = express.Router();
router.post("/add_pet", addPet);
router.get("/get_pets", getPets);

module.exports = router;
