const Shoot = require("../models/Shoot");
const Client = require("../models/Client");
const Order = require("../models/Order");
const Creator = require("../models/Creator");

// Create Shoot
const createShoot = async (req, res) => {
  try {
    console.log("SHOOT BODY:", req.body);

    const {
      client,
      order,
      creator,
      shootDate,
      startTime,
      endTime,
      location,
      status,
      notes,
    } = req.body || {};

    console.log("CLIENT:", client);
    console.log("ORDER:", order);
    console.log("CREATOR:", creator);
    console.log("SHOOT DATE:", shootDate);
    console.log("START TIME:", startTime);
    console.log("END TIME:", endTime);

    if (
      !client ||
      !order ||
      !creator ||
      !shootDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Client, order, creator, shoot date, start time and end time are required",
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

    const creatorExists = await Creator.findById(creator);

    if (!creatorExists) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const shoot = await Shoot.create({
      client,
      order,
      creator,
      shootDate,
      startTime,
      endTime,
      location,
      status: status || "scheduled",
      notes,
      createdBy: req.user._id,
    });

    const populatedShoot = await Shoot.findById(shoot._id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("creator", "name email phone category platform")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Shoot scheduled successfully",
      shoot: populatedShoot,
    });
  } catch (error) {
    console.error("Create Shoot Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Shoots
const getShoots = async (req, res) => {
  try {
    const shoots = await Shoot.find()
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("creator", "name email phone category platform")
      .populate("createdBy", "name email role")
      .sort({ shootDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: shoots.length,
      shoots,
    });
  } catch (error) {
    console.error("Get Shoots Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Shoot
const getShootById = async (req, res) => {
  try {
    const shoot = await Shoot.findById(req.params.id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("creator", "name email phone category platform")
      .populate("createdBy", "name email role");

    if (!shoot) {
      return res.status(404).json({
        success: false,
        message: "Shoot not found",
      });
    }

    res.status(200).json({
      success: true,
      shoot,
    });
  } catch (error) {
    console.error("Get Shoot Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Shoot
const updateShoot = async (req, res) => {
  try {
    const shoot = await Shoot.findById(req.params.id);

    if (!shoot) {
      return res.status(404).json({
        success: false,
        message: "Shoot not found",
      });
    }

    const allowedFields = [
      "client",
      "order",
      "creator",
      "shootDate",
      "startTime",
      "endTime",
      "location",
      "status",
      "notes",
    ];

    const body = req.body || {};

    const clientId = body.client || shoot.client;
    const orderId = body.order || shoot.order;

    if (body.client !== undefined) {
      const clientExists = await Client.findById(body.client);

      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (body.order !== undefined || body.client !== undefined) {
      const orderExists = await Order.findById(orderId);

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (orderExists.client.toString() !== clientId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Order does not belong to this client",
        });
      }
    }

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
        shoot[field] = body[field];
      }
    });

    await shoot.save();

    const updatedShoot = await Shoot.findById(shoot._id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType amount status")
      .populate("creator", "name email phone category platform")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Shoot updated successfully",
      shoot: updatedShoot,
    });
  } catch (error) {
    console.error("Update Shoot Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Shoot
const deleteShoot = async (req, res) => {
  try {
    const shoot = await Shoot.findById(req.params.id);

    if (!shoot) {
      return res.status(404).json({
        success: false,
        message: "Shoot not found",
      });
    }

    await shoot.deleteOne();

    res.status(200).json({
      success: true,
      message: "Shoot deleted successfully",
    });
  } catch (error) {
    console.error("Delete Shoot Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createShoot,
  getShoots,
  getShootById,
  updateShoot,
  deleteShoot,
};