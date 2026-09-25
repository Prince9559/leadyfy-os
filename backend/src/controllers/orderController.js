const Order = require("../models/Order");
const Client = require("../models/Client");
const createOrder = async (req, res) => {
  try {
    const {client,packageName,packageType,description,amount,status,startDate,endDate,assignedTo,} = req.body || {};

    if (!client || !packageName || amount === undefined) 
    {
      return res.status(400).json({
        success: false,
        message: "Client, package name and amount are required",
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

    const order = await Order.create({client,packageName,packageType,description,amount,status: status || "pending",startDate,endDate,assignedTo,createdBy: req.user._id,});

    const populatedOrder = await Order.findById(order._id).populate("client", "companyName contactPerson email").populate("assignedTo", "name email role").populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) 
  {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("client", "companyName contactPerson email").populate("assignedTo", "name email role").populate("createdBy", "name email role").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("client", "companyName contactPerson email").populate("assignedTo", "name email role").populate("createdBy", "name email role");
    if (!order) 
    {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) 
    {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedFields = ["client","packageName","packageType","description","amount","status","startDate","endDate","assignedTo",];

    const body = req.body || {};
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

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) 
      {
        order[field] = body[field];
      }
    });

    await order.save();

    const updatedOrder = await Order.findById(order._id).populate("client", "companyName contactPerson email").populate("assignedTo", "name email role").populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) 
    {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};