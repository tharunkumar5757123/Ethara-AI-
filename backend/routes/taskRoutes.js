const express = require("express");

const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require("../controllers/taskController");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// =====================
// GLOBAL PROTECTION
// =====================
router.use(auth);

// =====================
// DASHBOARD (PUT FIRST - IMPORTANT)
// =====================
router.get("/stats/dashboard", getDashboardStats);

// =====================
// TASK ROUTES
// =====================

// Get tasks for a project (Admin + Member with access check in controller)
router.get("/:projectId", getTasksByProject);

// Create task (ADMIN ONLY)
router.post("/", adminOnly, createTask);

// Update task (creator or assigned user handled in controller)
router.put("/:id", updateTask);

// Delete task (ADMIN ONLY)
router.delete("/:id", adminOnly, deleteTask);

module.exports = router;