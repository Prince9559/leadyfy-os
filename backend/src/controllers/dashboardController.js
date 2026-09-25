const Client = require("../models/Client");
const Order = require("../models/Order");
const Script = require("../models/Script");
const Shoot = require("../models/Shoot");
const Video = require("../models/Video");
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

const getDashboardStats = async (req, res) => {
  try {
    const [totalClients,activeClients,totalOrders,pendingOrders,totalScripts,totalShoots,totalVideos,videosInEditing,completedVideos,totalPayments,totalExpenses,] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: "active" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Script.countDocuments(),
      Shoot.countDocuments(),
      Video.countDocuments(),
      Video.countDocuments({ status: "video_editing" }),
      Video.countDocuments({ status: "delivered" }),
      Payment.countDocuments({ status: "completed" }),
      Expense.countDocuments({ status: "paid" }),
    ]);

    const paymentResult = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenseResult = await Expense.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalRevenue =paymentResult.length > 0 ? paymentResult[0].total : 0;
    const totalExpense =expenseResult.length > 0 ? expenseResult[0].total : 0;

    const netProfit = totalRevenue - totalExpense;

    res.status(200).json({
      success: true,
      dashboard: {
        clients: {total: totalClients,active: activeClients,},
        orders: {total: totalOrders,pending: pendingOrders,},
        scripts: {total: totalScripts,},
        shoots: {total: totalShoots,},
        videos: {total: totalVideos,inEditing: videosInEditing,delivered: completedVideos,},
        financial: {totalPayments,totalRevenue,totalExpenses: totalExpense,netProfit,},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};