const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async (req, res) => {
  try {
    const { user, title, message, type, link } = req.body;

    if (!user || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "User, title and message are required",
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      link,
      createdBy: req.user._id,
    });

    const populatedNotification = await Notification.findById(
      notification._id
    )
      .populate("user", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification: populatedNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("user", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate("user", "name email role")
      .populate("createdBy", "name email role");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const allowedFields = [
      "user",
      "title",
      "message",
      "type",
      "isRead",
      "link",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        notification[field] = req.body[field];
      }
    }

    if (req.body.user) {
      const userExists = await User.findById(req.body.user);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }

    await notification.save();

    const updatedNotification = await Notification.findById(
      notification._id
    )
      .populate("user", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      notification: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
};