const Creator = require("../models/Creator");

// Create Creator
const createCreator = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      platform,
      followers,
      location,
      profileUrl,
      status,
      notes,
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const existingCreator = await Creator.findOne({ email });

    if (existingCreator) {
      return res.status(400).json({
        success: false,
        message: "Creator with this email already exists",
      });
    }

    const creator = await Creator.create({
      name,
      email,
      phone,
      category,
      platform,
      followers,
      location,
      profileUrl,
      status: status || "active",
      notes,
      createdBy: req.user._id,
    });

    const populatedCreator = await Creator.findById(creator._id).populate(
      "createdBy",
      "name email role"
    );

    res.status(201).json({
      success: true,
      message: "Creator created successfully",
      creator: populatedCreator,
    });
  } catch (error) {
    console.error("Create Creator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Creators
const getCreators = async (req, res) => {
  try {
    const creators = await Creator.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: creators.length,
      creators,
    });
  } catch (error) {
    console.error("Get Creators Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Creator
const getCreatorById = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    res.status(200).json({
      success: true,
      creator,
    });
  } catch (error) {
    console.error("Get Creator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Creator
const updateCreator = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "category",
      "platform",
      "followers",
      "location",
      "profileUrl",
      "status",
      "notes",
    ];

    const body = req.body || {};

    if (body.email !== undefined && body.email !== creator.email) {
      const existingCreator = await Creator.findOne({
        email: body.email,
        _id: { $ne: creator._id },
      });

      if (existingCreator) {
        return res.status(400).json({
          success: false,
          message: "Creator with this email already exists",
        });
      }
    }

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        creator[field] = body[field];
      }
    });

    await creator.save();

    const updatedCreator = await Creator.findById(creator._id).populate(
      "createdBy",
      "name email role"
    );

    res.status(200).json({
      success: true,
      message: "Creator updated successfully",
      creator: updatedCreator,
    });
  } catch (error) {
    console.error("Update Creator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Creator
const deleteCreator = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    await creator.deleteOne();

    res.status(200).json({
      success: true,
      message: "Creator deleted successfully",
    });
  } catch (error) {
    console.error("Delete Creator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCreator,
  getCreators,
  getCreatorById,
  updateCreator,
  deleteCreator,
};