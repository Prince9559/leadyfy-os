const VideoFeedback = require("../models/VideoFeedback");
const Video = require("../models/Video");
const Client = require("../models/Client");
const User = require("../models/User");

// Create Feedback
const createFeedback = async (req, res) => {
  try {
    const {
      video,
      client,
      timestamp,
      comment,
      status,
    } = req.body || {};

    if (
      !video ||
      !client ||
      timestamp === undefined ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Video, client, timestamp and comment are required",
      });
    }

    const videoExists = await Video.findById(video);

    if (!videoExists) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const clientExists = await Client.findById(client);

    if (!clientExists) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (videoExists.client.toString() !== client.toString()) {
      return res.status(400).json({
        success: false,
        message: "Video does not belong to this client",
      });
    }

    if (timestamp < 0) {
      return res.status(400).json({
        success: false,
        message: "Timestamp cannot be negative",
      });
    }

    const feedback = await VideoFeedback.create({
      video,
      client,
      user: req.user._id,
      timestamp,
      comment,
      status: status || "open",
      createdBy: req.user._id,
    });

    const populatedFeedback = await VideoFeedback.findById(
      feedback._id
    )
      .populate("video", "title status")
      .populate("client", "companyName contactPerson email")
      .populate("user", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Video feedback created successfully",
      feedback: populatedFeedback,
    });
  } catch (error) {
    console.error("Create Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Feedback
// Get All Feedback
const getFeedbacks = async (req, res) => {
  try {
    let query = {};

    // Client can only see their own feedback
    if (req.user.role === "client") {
      const client = await Client.findOne({
        user: req.user._id,
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client profile not found",
        });
      }

      query.client = client._id;
    }

    const feedbacks = await VideoFeedback.find(query)
      .populate("video", "title status")
      .populate("client", "companyName contactPerson email")
      .populate("user", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("Get Feedbacks Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Single Feedback
// Get Single Feedback
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await VideoFeedback.findById(req.params.id)
      .populate("video", "title status")
      .populate("client", "companyName contactPerson email")
      .populate("user", "name email role")
      .populate("createdBy", "name email role");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Client can only access feedback belonging to their client profile
    if (req.user.role === "client") {
      const client = await Client.findOne({
        user: req.user._id,
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client profile not found",
        });
      }

      if (feedback.client._id.toString() !== client._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Feedback
const updateFeedback = async (req, res) => {
  try {
    const feedback = await VideoFeedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    const body = req.body || {};

    if (body.video !== undefined) {
      const videoExists = await Video.findById(body.video);

      if (!videoExists) {
        return res.status(404).json({
          success: false,
          message: "Video not found",
        });
      }

      const clientId = body.client || feedback.client;

      if (videoExists.client.toString() !== clientId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Video does not belong to this client",
        });
      }
    }

    if (body.client !== undefined) {
      const clientExists = await Client.findById(body.client);

      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }

      const videoId = body.video || feedback.video;

      const videoExists = await Video.findById(videoId);

      if (
        videoExists &&
        videoExists.client.toString() !== body.client.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Video does not belong to this client",
        });
      }
    }

    if (body.timestamp !== undefined && body.timestamp < 0) {
      return res.status(400).json({
        success: false,
        message: "Timestamp cannot be negative",
      });
    }

    const allowedFields = [
      "video",
      "client",
      "timestamp",
      "comment",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        feedback[field] = body[field];
      }
    });

    await feedback.save();

    const updatedFeedback = await VideoFeedback.findById(
      feedback._id
    )
      .populate("video", "title status")
      .populate("client", "companyName contactPerson email")
      .populate("user", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Video feedback updated successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("Update Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await VideoFeedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: "Video feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};