const CreatorAvailability = require("../models/CreatorAvailability");
const Creator = require("../models/Creator");

// Create Availability
const createAvailability = async (req, res) => {
  try {
    const {
      creator,
      date,
      startTime,
      endTime,
      status,
      notes,
    } = req.body || {};

    if (!creator || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Creator, date, start time and end time are required",
      });
    }

    const creatorExists = await Creator.findById(creator);

    if (!creatorExists) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const availability = await CreatorAvailability.create({
      creator,
      date,
      startTime,
      endTime,
      status: status || "available",
      notes,
      createdBy: req.user._id,
    });

    const populatedAvailability =
      await CreatorAvailability.findById(availability._id)
        .populate("creator", "name email phone category platform")
        .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Creator availability created successfully",
      availability: populatedAvailability,
    });
  } catch (error) {
    console.error("Create Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Availability
const getAvailabilities = async (req, res) => {
  try {
    const availabilities = await CreatorAvailability.find()
      .populate("creator", "name email phone category platform")
      .populate("createdBy", "name email role")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: availabilities.length,
      availabilities,
    });
  } catch (error) {
    console.error("Get Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Availability
const getAvailabilityById = async (req, res) => {
  try {
    const availability = await CreatorAvailability.findById(req.params.id)
      .populate("creator", "name email phone category platform")
      .populate("createdBy", "name email role");

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Creator availability not found",
      });
    }

    res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("Get Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Availability
const updateAvailability = async (req, res) => {
  try {
    const availability = await CreatorAvailability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Creator availability not found",
      });
    }

    const allowedFields = [
      "creator",
      "date",
      "startTime",
      "endTime",
      "status",
      "notes",
    ];

    const body = req.body || {};

    if (body.creator !== undefined) {
      const creatorExists = await Creator.findById(body.creator);

      if (!creatorExists) {
        return res.status(404).json({
          success: false,
          message: "Creator not found",
        });
      }
    }

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        availability[field] = body[field];
      }
    });

    await availability.save();

    const updatedAvailability =
      await CreatorAvailability.findById(availability._id)
        .populate("creator", "name email phone category platform")
        .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Creator availability updated successfully",
      availability: updatedAvailability,
    });
  } catch (error) {
    console.error("Update Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Availability
const deleteAvailability = async (req, res) => {
  try {
    const availability = await CreatorAvailability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Creator availability not found",
      });
    }

    await availability.deleteOne();

    res.status(200).json({
      success: true,
      message: "Creator availability deleted successfully",
    });
  } catch (error) {
    console.error("Delete Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAvailability,
  getAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
};