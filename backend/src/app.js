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
const videoRoutes = require("./routes/videoRoutes");
const videoFeedbackRoutes = require("./routes/videoFeedbackRoutes");
const taskRoutes = require("./routes/taskRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const payoutRoutes = require("./routes/payoutRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const supportRoutes = require("./routes/supportRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const assetRoutes = require("./routes/assetRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

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
app.use("/api/videos", videoRoutes);
app.use("/api/video-feedback", videoFeedbackRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

module.exports = app;