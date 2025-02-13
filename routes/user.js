const express = require("express");
const { signupUser, getUsers } = require("../controllers/userController");

const router = express.Router();
router.post("/signup", signupUser);
router.get("/get_user", getUsers);

module.exports = router;
