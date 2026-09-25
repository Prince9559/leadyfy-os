const Employee = require("../models/Employee");
const User = require("../models/User");

const createEmployee = async (req, res) => {
  try {
    const {user,employeeId,department,designation,phone,joiningDate,status,salary,skills,notes,} = req.body;

    if (!user || !employeeId) 
    {
      return res.status(400).json({
        success: false,
        message: "User and employeeId are required",
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) 
    {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingEmployee = await Employee.findOne({$or: [{ user }, { employeeId }],});
    if (existingEmployee) 
    {
      return res.status(400).json({
        success: false,
        message: "Employee already exists for this user or employeeId",
      });
    }

    const employee = await Employee.create({user,employeeId,department,designation,phone,joiningDate,status,salary,skills,notes,});
    const populatedEmployee = await Employee.findById(employee._id).populate("user","name email role isActive");

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: populatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("user", "name email role isActive").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("user","name email role isActive");

    if (!employee) 
    {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) 
    {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const {employeeId,department,designation,phone,joiningDate,status,salary,skills,notes,} = req.body;

    if (employeeId !== undefined &&employeeId !== employee.employeeId) 
    {
      const existingEmployee = await Employee.findOne({employeeId,_id: { $ne: employee._id },});
      if (existingEmployee) 
      {
        return res.status(400).json({
          success: false,
          message: "Employee ID already exists",
        });
      }

      employee.employeeId = employeeId;
    }

    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;
    if (phone !== undefined) employee.phone = phone;
    if (joiningDate !== undefined) employee.joiningDate = joiningDate;
    if (status !== undefined) employee.status = status;
    if (salary !== undefined) employee.salary = salary;
    if (skills !== undefined) employee.skills = skills;
    if (notes !== undefined) employee.notes = notes;

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id).populate("user","name email role isActive");

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) 
  {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) 
    {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.deleteOne();
    res.status(200).json({success: true,message: "Employee deleted successfully",});
  } catch (error) 
  {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};