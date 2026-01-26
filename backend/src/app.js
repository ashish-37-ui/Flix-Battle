const express = require("express");
const cors = require("cors");

const battleRoutes = require("./routes/battleRoutes");
const userRoutes = require("./routes/userRoutes");




const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);


// Routes
app.use("/api/battles", battleRoutes);

app.get("/", (req, res) => {
  res.send("FlixBattle backend is running 🚀");
});

module.exports = app;
