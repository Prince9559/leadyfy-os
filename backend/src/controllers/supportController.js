const SupportTicket = require("../models/SupportTicket");
const User = require("../models/User");
const Client = require("../models/Client");

const createSupportTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      client,
      assignedTo,
      priority,
      status,
      category,
      resolution,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
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

    if (assignedTo) {
      const userExists = await User.findById(assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    const ticket = await SupportTicket.create({
      title,
      description,
      client,
      createdBy: req.user._id,
      assignedTo,
      priority,
      status,
      category,
      resolution,
    });

    const populatedTicket = await SupportTicket.findById(ticket._id)
      .populate("client", "companyName contactPerson email")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket: populatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("client", "companyName contactPerson email")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupportTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate("client", "companyName contactPerson email")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "client",
      "assignedTo",
      "priority",
      "status",
      "category",
      "resolution",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    }

    if (req.body.client) {
      const clientExists = await Client.findById(req.body.client);

      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (req.body.assignedTo) {
      const userExists = await User.findById(req.body.assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate("client", "companyName contactPerson email")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      success: true,
      message: "Support ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      success: true,
      message: "Support ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
};