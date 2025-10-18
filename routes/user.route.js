const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {checkRole} = require('../middlewares/role.middleware')
const jwt = require("jsonwebtoken");


router.get("/register", userController.registerPage);
router.post("/register", userController.signup);
router.get("/login", userController.loginPage);
router.post("/login", userController.login);
router.get("/logout", userController.logout);


router.get("/", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (decoded.role === "admin") return res.redirect("/admin/dashboard");
    if (decoded.role === "manager") return res.redirect("/manager/dashboard");
    return res.redirect("/employee/dashboard");
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
});


router.get(
  "/admin/dashboard",
  verifyToken,
  authorizeRoles("admin"),
  userController.adminDashboard
);

router.get(
  "/admin/create",
  verifyToken,
  checkRole(["admin"]),
  userController.createUserPage
);


router.post(
  "/admin/create",
  verifyToken,
  checkRole(["admin"]),
  userController.createUserFromForm
);

router.get(
  "/admin/edit/:id",
  verifyToken,
  authorizeRoles("admin"),
  userController.editUserPage
);
router.post(
  "/admin/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  userController.updateUser
);
router.get(
  "/admin/delete/:id",
  verifyToken,
  authorizeRoles("admin"),
  userController.deleteUser
);


router.get(
  "/manager/dashboard",
  verifyToken,
  authorizeRoles("manager", "admin"),
  userController.managerDashboard
);

router.get(
  "/manager/create",
  verifyToken,
  authorizeRoles("manager"),
  userController.createEmployeePage
);


router.post(
  "/manager/create",
  verifyToken,
  authorizeRoles("manager"),
  userController.createEmployee
);

router.get(
  "/manager/edit/:id",
  verifyToken,
  authorizeRoles("manager"),
  userController.editEmployeePage
);
router.post(
  "/manager/update/:id",
  verifyToken,
  authorizeRoles("manager"),
  userController.updateEmployee
);
router.get(
  "/manager/delete/:id",
  verifyToken,
  authorizeRoles("manager"),
  userController.deleteEmployee
);


router.get("/admin/dashboard", verifyToken, checkRole(["Admin"]), userController.adminDashboard);


router.get("/admin/edit/:id", verifyToken, checkRole(["Admin"]), userController.adminEditPage);


router.post("/admin/update/:id", verifyToken, checkRole(["Admin"]), userController.adminUpdateUser);


router.get("/admin/delete/:id", verifyToken, checkRole(["Admin"]), userController.adminDeleteUser);


router.get(
  "/employee/dashboard",
  verifyToken,
  authorizeRoles("employee", "manager", "admin"), // ✅ allow employee + higher roles
  userController.employeeDashboard
);


module.exports = router;

