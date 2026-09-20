const Client = require("../models/Client");

// Add Client
 const createClient = async (req, res) => {
  try {
    const {
      user,
      companyName,
      contactPerson,
      email,
      phone,
      website,
      industry,
      address,
      status,
    } = req.body || {};

    if (!companyName || !contactPerson || !email) {
      return res.status(400).json({
        success: false,
        message: "Company name, contact person and email are required",
      });
    }

    const existingClient = await Client.findOne({ email });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
      });
    }

    const client = await Client.create({
      user: user || null,
      companyName,
      contactPerson,
      email,
      phone,
      website,
      industry,
      address,
      status: status || "active",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("Create Client Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Clients
const getClients = async (req, res) => {
  try {
    let query = {};

    // Client can only see their own client record
    if (req.user.role === "client") {
      query.email = req.user.email;
    }

    const clients = await Client.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    console.error("Get Clients Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Client
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Client can only access their own record
    if (
      req.user.role === "client" &&
      client.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Get Client Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Client
// Update Client
const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Client can only update their own record
    if (
      req.user.role === "client" &&
      client.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const allowedFields = [
      "user",
      "companyName",
      "contactPerson",
      "email",
      "phone",
      "website",
      "industry",
      "address",
      "status",
    ];

    const body = req.body || {};

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        client[field] = body[field];
      }
    });

    await client.save();

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Update Client Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete Client Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};