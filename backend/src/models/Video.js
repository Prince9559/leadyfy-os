const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    script: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Script",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "script_approved",
        "shoot_pending",
        "raw_footage_received",
        "video_editing",
        "internal_qa",
        "client_review",
        "revision",
        "final_approved",
        "delivered",
      ],
      default: "script_approved",
    },

    assignedEditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    duration: {
      type: Number,
      min: 0,
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
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;