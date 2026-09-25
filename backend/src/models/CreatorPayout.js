const mongoose = require("mongoose");

const creatorPayoutSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    payoutDate: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "upi", "other"],
      default: "bank_transfer",
    },

    transactionId: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CreatorPayout = mongoose.model("CreatorPayout",creatorPayoutSchema);

module.exports = CreatorPayout;