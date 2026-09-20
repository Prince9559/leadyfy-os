const Expense = require("../models/Expense");

// Create Expense
const createExpense = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      amount,
      expenseDate,
      paymentMethod,
      status,
      notes,
    } = req.body || {};

    if (!title || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title and amount are required",
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const expense = await Expense.create({
      title,
      description,
      category: category || "other",
      amount,
      expenseDate,
      paymentMethod: paymentMethod || "bank_transfer",
      status: status || "paid",
      notes,
      createdBy: req.user._id,
    });

    const populatedExpense = await Expense.findById(expense._id).populate(
      "createdBy",
      "name email role"
    );

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: populatedExpense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Expense
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get Expense Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const body = req.body || {};

    if (body.amount !== undefined && body.amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "amount",
      "expenseDate",
      "paymentMethod",
      "status",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        expense[field] = body[field];
      }
    });

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id).populate(
      "createdBy",
      "name email role"
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};