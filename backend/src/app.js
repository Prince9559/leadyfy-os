const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const orderRoutes = require("./routes/orderRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const creatorRoutes = require("./routes/creatorRoutes");
const creatorAvailabilityRoutes = require("./routes/creatorAvailabilityRoutes");
const shootRoutes = require("./routes/shootRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Leadyfy OS API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/scripts", scriptRoutes);
app.use("/api/creators", creatorRoutes);
app.use("/api/creator-availability", creatorAvailabilityRoutes);
app.use("/api/shoots", shootRoutes);

module.exports = app;