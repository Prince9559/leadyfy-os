const Script = require("../models/Script");
const Client = require("../models/Client");
const Order = require("../models/Order");

// Create Script
const createScript = async (req, res) => {
  try {
    const {
      client,
      order,
      title,
      content,
      status,
      assignedTo,
      revisionNote,
    } = req.body || {};

    if (!client || !order || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Client, order, title and content are required",
      });
    }

    const clientExists = await Client.findById(client);

    if (!clientExists) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const orderExists = await Order.findById(order);

    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderExists.client.toString() !== client.toString()) {
      return res.status(400).json({
        success: false,
        message: "Order does not belong to this client",
      });
    }

    const script = await Script.create({
      client,
      order,
      title,
      content,
      status: status || "draft",
      assignedTo,
      revisionNote,
      createdBy: req.user._id,
    });

    const populatedScript = await Script.findById(script._id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Script created successfully",
      script: populatedScript,
    });
  } catch (error) {
    console.error("Create Script Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Scripts
const getScripts = async (req, res) => {
  try {
    const scripts = await Script.find()
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scripts.length,
      scripts,
    });
  } catch (error) {
    console.error("Get Scripts Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Script
const getScriptById = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Script not found",
      });
    }

    res.status(200).json({
      success: true,
      script,
    });
  } catch (error) {
    console.error("Get Script Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Script
const updateScript = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Script not found",
      });
    }

    const allowedFields = [
      "client",
      "order",
      "title",
      "content",
      "status",
      "assignedTo",
      "revisionNote",
      "approvedAt",
    ];

    const body = req.body || {};

    if (body.client !== undefined) {
      const clientExists = await Client.findById(body.client);

      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (body.order !== undefined) {
      const orderExists = await Order.findById(body.order);

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const clientId = body.client || script.client;

      if (orderExists.client.toString() !== clientId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Order does not belong to this client",
        });
      }
    }

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        script[field] = body[field];
      }
    });

    if (body.status === "approved" && !script.approvedAt) {
      script.approvedAt = new Date();
    }

    await script.save();

    const updatedScript = await Script.findById(script._id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Script updated successfully",
      script: updatedScript,
    });
  } catch (error) {
    console.error("Update Script Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Script
const deleteScript = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Script not found",
      });
    }

    await script.deleteOne();

    res.status(200).json({
      success: true,
      message: "Script deleted successfully",
    });
  } catch (error) {
    console.error("Delete Script Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createScript,
  getScripts,
  getScriptById,
  updateScript,
  deleteScript,
};