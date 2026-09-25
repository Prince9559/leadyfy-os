const Video = require("../models/Video");
const Client = require("../models/Client");
const Order = require("../models/Order");
const Script = require("../models/Script");
const User = require("../models/User");
const createVideo = async (req, res) => {
  try {
    const {client,order,script,title,videoUrl,thumbnailUrl,status,assignedEditor,duration,notes,}=req.body || {};

    if (!client || !order || !title) 
    {
      return res.status(400).json({
        success: false,
        message: "Client, order and title are required",
      });
    }

    const clientExists = await Client.findById(client);
    if (!clientExists) 
    {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const orderExists = await Order.findById(order);

    if (!orderExists) 
    {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderExists.client.toString() !== client.toString()) 
    {
      return res.status(400).json({
        success: false,
        message: "Order does not belong to this client",
      });
    }

    if (script) 
    {
      const scriptExists = await Script.findById(script);
      if (!scriptExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Script not found",
        });
      }

      if (scriptExists.client.toString() !== client.toString()) 
      {
        return res.status(400).json({
          success: false,
          message: "Script does not belong to this client",
        });
      }

      if (scriptExists.order.toString() !== order.toString())
       {
        return res.status(400).json({
          success: false,
          message: "Script does not belong to this order",
        });
      }
    }

    if (assignedEditor) 
    {
      const editorExists = await User.findById(assignedEditor);
      if (!editorExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Assigned editor not found",
        });
      }
    }

    const video = await Video.create({client,order,script,title,videoUrl,thumbnailUrl,status: status || "script_approved",assignedEditor,duration,notes,createdBy: req.user._id,});

    const populatedVideo = await Video.findById(video._id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("script", "title status").populate("assignedEditor", "name email role").populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Video created successfully",
      video: populatedVideo,
    });
  } catch (error) 
   {
    console.error("Create Video Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("script", "title status").populate("assignedEditor", "name email role").populate("createdBy", "name email role").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) 
  {
    console.error("Get Videos Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("script", "title status").populate("assignedEditor", "name email role").populate("createdBy", "name email role");
    if (!video) 
    {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error("Get Video Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) 
    {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const body = req.body || {};
    const clientId = body.client || video.client;
    const orderId = body.order || video.order;

    if (body.client !== undefined) 
    {
      const clientExists = await Client.findById(body.client);
      if (!clientExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (body.order !== undefined || body.client !== undefined) 
    {
      const orderExists = await Order.findById(orderId);
      if (!orderExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (orderExists.client.toString() !== clientId.toString()) 
      {
        return res.status(400).json({
          success: false,
          message: "Order does not belong to this client",
        });
      }
    }

    if (body.script !== undefined && body.script) 
    {
      const scriptExists = await Script.findById(body.script);
      if (!scriptExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Script not found",
        });
      }

      if (scriptExists.client.toString() !== clientId.toString()) 
      {
        return res.status(400).json({
          success: false,
          message: "Script does not belong to this client",
        });
      }

      if (scriptExists.order.toString() !== orderId.toString()) 
      {
        return res.status(400).json({
          success: false,
          message: "Script does not belong to this order",
        });
      }
    }

    if (body.assignedEditor !== undefined && body.assignedEditor) 
    {
      const editorExists = await User.findById(body.assignedEditor);
      if (!editorExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Assigned editor not found",
        });
      }
    }

    const allowedFields = ["client","order","script","title","videoUrl","thumbnailUrl","status","assignedEditor","duration","notes",];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) 
      {
        video[field] = body[field];
      }
    });

    await video.save();
    const updatedVideo = await Video.findById(video._id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("script", "title status").populate("assignedEditor", "name email role").populate("createdBy", "name email role");
    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    console.error("Update Video Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) 
    {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    await video.deleteOne();
    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete Video Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clientReviewVideo = async (req, res) => {
  try {
    const { action } = req.body || {};
    if (!["approve", "revision"].includes(action)) 
    {
      return res.status(400).json({
        success: false,
        message: "Action must be approve or revision",
      });
    }

    const video = await Video.findById(req.params.id);
    if (!video) 
    {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const client = await Client.findOne({user: req.user._id,});
    if (!client) 
    {
      return res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
    }

    if (video.client.toString() !== client._id.toString()) 
    {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (video.status !== "client_review") 
    {
      return res.status(400).json({
        success: false,
        message: "Video is not available for client review",
      });
    }

    if (action === "approve") 
    {
      video.status = "final_approved";
    }

    if (action === "revision") 
    {
      video.status = "revision";
    }

    await video.save();
    const updatedVideo = await Video.findById(video._id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("script", "title status").populate("assignedEditor", "name email role").populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message:action === "approve" ? "Video approved successfully" : "Revision requested successfully",
      video: updatedVideo,
    });
  } catch (error) {
    console.error("Client Review Video Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  clientReviewVideo,
};