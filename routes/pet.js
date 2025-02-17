const express = require("express");
const { addPet,getPets, getPetsByOwner, searchPets } = require("../controllers/petController");
const router = express.Router();

router.post("/add_pet", addPet);
router.get("/get_pets", getPets);
router.get("/get_pets_by_owner/:owner_id", getPetsByOwner);
router.get("/search_pets", searchPets);

module.exports = router;
