const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    category: {
      type: String,
      enum: [
        "technical",
        "billing",
        "content",
        "account",
        "general",
      ],
      default: "general",
    },

    resolution: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);

module.exports = SupportTicket;