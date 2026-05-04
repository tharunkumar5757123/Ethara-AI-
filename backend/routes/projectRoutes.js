const express = require("express");

const {
  getProjects,
  getProject,
  createProject,
  addMember,
  removeMember,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// =====================
// GLOBAL PROTECTION
// =====================
router.use(auth);

// =====================
// PROJECT ROUTES
// =====================

// Get all projects (Admin + Member)
router.get("/", getProjects);

// Get single project (Admin + Member with access check inside controller)
router.get("/:id", getProject);

// =====================
// ADMIN ONLY PROJECT ACTIONS
// =====================
router.post("/", adminOnly, createProject);
router.put("/:id", adminOnly, updateProject);
router.delete("/:id", adminOnly, deleteProject);

// =====================
// MEMBER MANAGEMENT (CREATOR CHECK INSIDE CONTROLLER)
// =====================
router.post("/:id/add-member", addMember);
router.delete("/:id/remove-member/:memberId", removeMember);

module.exports = router;