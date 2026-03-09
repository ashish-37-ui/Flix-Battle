const express = require("express");
const cors = require("cors");

const battleRoutes = require("./routes/battleRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/battles", battleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;