const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signupUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:user_id", userController.getUserById);

module.exports = router;
