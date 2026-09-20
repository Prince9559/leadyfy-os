const CreatorPayout = require("../models/CreatorPayout");
const Creator = require("../models/Creator");

const createCreatorPayout = async (req, res) => {
  try {
    const {
      creator,
      amount,
      payoutDate,
      paymentMethod,
      transactionId,
      status,
      notes,
    } = req.body;

    if (!creator || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Creator and amount are required",
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const creatorExists = await Creator.findById(creator);

    if (!creatorExists) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const payout = await CreatorPayout.create({
      creator,
      amount,
      payoutDate,
      paymentMethod,
      transactionId,
      status,
      notes,
      createdBy: req.user._id,
    });

    const populatedPayout = await CreatorPayout.findById(payout._id)
      .populate("creator", "name email phone platform")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Creator payout created successfully",
      payout: populatedPayout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCreatorPayouts = async (req, res) => {
  try {
    const payouts = await CreatorPayout.find()
      .populate("creator", "name email phone platform")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payouts.length,
      payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCreatorPayoutById = async (req, res) => {
  try {
    const payout = await CreatorPayout.findById(req.params.id)
      .populate("creator", "name email phone platform")
      .populate("createdBy", "name email role");

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Creator payout not found",
      });
    }

    res.status(200).json({
      success: true,
      payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCreatorPayout = async (req, res) => {
  try {
    const payout = await CreatorPayout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Creator payout not found",
      });
    }

    const allowedFields = [
      "creator",
      "amount",
      "payoutDate",
      "paymentMethod",
      "transactionId",
      "status",
      "notes",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        payout[field] = req.body[field];
      }
    }

    if (payout.amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    if (req.body.creator) {
      const creatorExists = await Creator.findById(req.body.creator);

      if (!creatorExists) {
        return res.status(404).json({
          success: false,
          message: "Creator not found",
        });
      }
    }

    await payout.save();

    const updatedPayout = await CreatorPayout.findById(payout._id)
      .populate("creator", "name email phone platform")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Creator payout updated successfully",
      payout: updatedPayout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCreatorPayout = async (req, res) => {
  try {
    const payout = await CreatorPayout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Creator payout not found",
      });
    }

    await payout.deleteOne();

    res.status(200).json({
      success: true,
      message: "Creator payout deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCreatorPayout,
  getCreatorPayouts,
  getCreatorPayoutById,
  updateCreatorPayout,
  deleteCreatorPayout,
};