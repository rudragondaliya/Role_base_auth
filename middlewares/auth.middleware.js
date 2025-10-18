const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
     console.log("Decoded Token:", decoded); 
    
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect("/login");

    req.user = user; 
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};
