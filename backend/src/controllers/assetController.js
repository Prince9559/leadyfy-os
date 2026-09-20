const Asset = require("../models/Asset");
const Client = require("../models/Client");
const Order = require("../models/Order");

const createAsset = async (req, res) => {
  try {
    const {
      name,
      type,
      url,
      client,
      order,
      description,
      status,
    } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required",
      });
    }

    if (client) {
      const clientExists = await Client.findById(client);

      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (order) {
      const orderExists = await Order.findById(order);

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    const asset = await Asset.create({
      name,
      type,
      url,
      client,
      order,
      uploadedBy: req.user._id,
      description,
      status,
    });

    const populatedAsset = await Asset.findById(asset._id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType status")
      .populate("uploadedBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      asset: populatedAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find()
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType status")
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType status")
      .populate("uploadedBy", "name email role");

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const {
      name,
      type,
      url,
      client,
      order,
      description,
      status,
    } = req.body;

    if (client) {
      const clientExists = await Client.findById(client);

      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (order) {
      const orderExists = await Order.findById(order);

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    if (name !== undefined) asset.name = name;
    if (type !== undefined) asset.type = type;
    if (url !== undefined) asset.url = url;
    if (client !== undefined) asset.client = client;
    if (order !== undefined) asset.order = order;
    if (description !== undefined) asset.description = description;
    if (status !== undefined) asset.status = status;

    await asset.save();

    const updatedAsset = await Asset.findById(asset._id)
      .populate("client", "companyName contactPerson email")
      .populate("order", "packageName packageType status")
      .populate("uploadedBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      asset: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    await asset.deleteOne();

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};