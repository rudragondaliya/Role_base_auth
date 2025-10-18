const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.PRIVATE_KEY || 'change_this_secret';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  
  maxAge: 7 * 24 * 60 * 60 * 1000 
};

exports.loginPage = (req, res) => res.render('pages/login');
exports.registerPage = (req, res) => res.render('pages/register');


exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.render('pages/register', { error: 'User already exists' });

    const user = new User({ name, email, password, role });
    await user.save();
    return res.redirect('/login');
  } catch (err) {
    console.error('signup error:', err.message);
    return res.render('pages/register', { error: 'Something went wrong' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render('pages/login', { error: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.render('pages/login', { error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, COOKIE_OPTIONS);

    if (user.role === 'admin') return res.redirect('/admin/dashboard');
    if (user.role === 'manager') return res.redirect('/manager/dashboard');
    return res.redirect('/employee/dashboard');
  } catch (err) {
    console.error('login error:', err.message);
    return res.render('pages/login', { error: 'Something went wrong' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.redirect('/login');
};


exports.createUser = async (req, res) => {
  try {
    const creatorRole = req.user.role;
    const { name, email, password, role } = req.body;

    // Role creation rules
    if (creatorRole === 'manager' && role !== 'employee') {
      return res.status(403).json({ message: 'Managers can only create employees' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    return res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('createUser error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let users;
    if (req.user.role === 'manager') {
      users = await User.find({ role: 'employee' }).select('-password');
    } else {
      users = await User.find({}).select('-password');
    }
    return res.json(users);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    // Manager cannot delete admin/manager
    if (req.user.role === 'manager' && target.role !== 'employee') {
      return res.status(403).json({ message: 'Managers can only delete employees' });
    }

    await User.findByIdAndDelete(id);
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('deleteUser error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json(user);
  } catch (err) {
    console.error('getMyProfile error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};


module.exports.dashboard = async (req, res) => {
  try {
    const user = req.user;
    let users = [];

    if (user.role === "admin") {
      users = await User.find();
      return res.render("admin/dashboard", { user, users });
    }

    if (user.role === "manager") {
      users = await User.find({ role: "employee" });
      return res.render("manager/dashboard", { user, users });
    }

    
    return res.render("employee/dashboard", { user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.employeeDashboard = async (req, res) => {
  try {
    const user = req.user;
    res.render("employee/dashboard", {
      title: "Employee Dashboard",
      user, // pass user data for sidebar/header
    });
  } catch (error) {
    console.error("Error loading employee dashboard:", error);
    res.status(500).send("Internal Server Error");
  }
};


// ===================== ADMIN DASHBOARD CRUD =====================


exports.adminDashboard = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.render("admin/dashboard", { user: req.user, users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


exports.createUserPage = (req, res) => {
  res.render("admin/createUser", { user: req.user, error: null });
};

exports.createUserFromForm = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

   
    if (!name || !email || !password || !role) {
      return res.render("admin/createUser", { user: req.user, error: "All fields are required!" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("admin/createUser", { user: req.user, error: "Email already exists!" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    return res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Create user error:", err.message);
    res.render("admin/createUser", { user: req.user, error: "Something went wrong!" });
  }
};



exports.editUserPage = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id);
    res.render("pages/editUser", { userData, user: req.user });
  } catch (error) {
    res.status(500).send("Error loading edit page");
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Error updating user");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
};

// ===================== MANAGER DASHBOARD CRUD =====================


exports.managerDashboard = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" }).select("-password");
    res.render("manager/dashboard", { user: req.user, users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


exports.createEmployeePage = (req, res) => {
  try {
    return res.render("manager/createEmployee", { user: req.user, error: null });
  } catch (error) {
    console.error("Error rendering create employee page:", error.message);
    res.status(500).send("Internal Server Error");
  }
};


exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.redirect("/manager/dashboard");
  } catch (error) {
    console.error("Create Employee Error:", error.message);
    res.status(500).send("Error creating employee");
  }
};



exports.editEmployeePage = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id);
    res.render("pages/editEmployee", { userData, user: req.user });
  } catch (error) {
    res.status(500).send("Error loading edit page");
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email });
    res.redirect("/manager/dashboard");
  } catch (error) {
    res.status(500).send("Error updating employee");
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/manager/dashboard");
  } catch (error) {
    res.status(500).send("Error deleting employee");
  }
};



module.exports.adminEditPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.render("pages/admin-edit", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit page");
  }
};


module.exports.adminUpdateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

module.exports.adminDeleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};
