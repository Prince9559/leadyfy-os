const Task = require("../models/Task");
const User = require("../models/User");
const Client = require("../models/Client");
const Order = require("../models/Order");
const createTask = async (req, res) => {
  try {
    const {title,description,assignedTo,client,order,priority,status,dueDate,} = req.body || {};

    if (!title || !assignedTo) 
    {
      return res.status(400).json({
        success: false,
        message: "Title and assignedTo are required",
      });
    }

    const userExists = await User.findById(assignedTo);
    if (!userExists) 
    {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    if (client) 
    {
      const clientExists = await Client.findById(client);
      if (!clientExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    if (order) 
    {
      const orderExists = await Order.findById(order);
      if (!orderExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    const task = await Task.create({title,description,assignedTo,client,order,priority: priority || "medium",status: status || "todo",dueDate,createdBy: req.user._id,});
    const populatedTask = await Task.findById(task._id).populate("assignedTo", "name email role").populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email role").populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) 
  {
    console.error("Get Tasks Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email role").populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role");
    if (!task) 
    {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) 
  {
    console.error("Get Task Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) 
    {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const body = req.body || {};
    if (body.assignedTo !== undefined) 
    {
      const userExists = await User.findById(body.assignedTo);
      if (!userExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    if (body.client !== undefined && body.client) 
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

    if (body.order !== undefined && body.order) 
    {
      const orderExists = await Order.findById(body.order);
      if (!orderExists) 
      {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    const allowedFields = ["title","description","assignedTo","client","order","priority","status","dueDate",];
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) 
      {
        task[field] = body[field];
      }
    });

    await task.save();
    const updatedTask = await Task.findById(task._id).populate("assignedTo", "name email role").populate("client", "companyName contactPerson email").populate("order", "packageName packageType amount status").populate("createdBy", "name email role");
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) 
  {
    console.error("Update Task Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) 
    {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) 
  {
    console.error("Delete Task Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};