const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const petRoutes = require("./routes/pet");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/pets", petRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Pet Care API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
