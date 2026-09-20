const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

const createActivityLog = async (req, res) => {
  try {
    const {
      user,
      action,
      entityType,
      entityId,
      description,
      metadata,
    } = req.body;

    if (!user || !action || !entityType) {
      return res.status(400).json({
        success: false,
        message: "User, action and entityType are required",
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const activityLog = await ActivityLog.create({
      user,
      action,
      entityType,
      entityId,
      description,
      metadata,
    });

    const populatedLog = await ActivityLog.findById(activityLog._id)
      .populate("user", "name email role");

    res.status(201).json({
      success: true,
      message: "Activity log created successfully",
      activityLog: populatedLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      activityLogs: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
      .populate("user", "name email role");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found",
      });
    }

    res.status(200).json({
      success: true,
      activityLog: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found",
      });
    }

    await log.deleteOne();

    res.status(200).json({
      success: true,
      message: "Activity log deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  deleteActivityLog,
};