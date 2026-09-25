const Payment = require("../models/Payment");
const Client = require("../models/Client");
const Order = require("../models/Order");

const createPayment = async (req, res) => {
  try {
    const {client,order,amount,paymentMethod,transactionId,paymentDate,status,notes,} = req.body || {};
    if (!client || !order || amount === undefined) 
    {
      return res.status(400).json({
        success: false,
        message: "Client, order and amount are required",
      });
    }

    if (amount < 0) 
    {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
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

    const payment = await Payment.create({client,order,amount,paymentMethod: paymentMethod || "bank_transfer",transactionId,paymentDate,status: status || "completed",notes,createdBy: req.user._id,});
    const populatedPayment = await Payment.findById(payment._id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get Payments Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role");
    if (!payment) 
    {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({success: true,payment,});
  } catch (error) 
  {
    console.error("Get Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) 
    {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const body = req.body || {};
    if (body.amount !== undefined && body.amount < 0) 
    {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

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

    if (body.order !== undefined) 
    {
      const orderExists = await Order.findById(body.order);
      if (!orderExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const clientId = body.client || payment.client;
      if (orderExists.client.toString() !== clientId.toString()) 
      {
        return res.status(400).json({
          success: false,
          message: "Order does not belong to this client",
        });
      }
    }

    const allowedFields = ["client","order","amount","paymentMethod","transactionId","paymentDate","status","notes",];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) 
      {
        payment[field] = body[field];
      }
    });

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id).populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) 
  {
    console.error("Update Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) 
    {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await payment.deleteOne();
    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) 
  {
    console.error("Delete Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};