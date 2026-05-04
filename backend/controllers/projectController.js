const Project = require("../models/Project");
const User = require("../models/User");

// =====================
// GET ALL PROJECTS
// =====================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id },
      ],
    }).populate("members", "name email role");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// GET SINGLE PROJECT
// =====================
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email role"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isCreator = project.createdBy.toString() === req.user.id;

    const isMember = project.members?.some(
      (m) => m._id.toString() === req.user.id
    );

    if (!isCreator && !isMember) {
      return res.status(403).json({
        message: "Not authorized to access this project",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// CREATE PROJECT (ADMIN ONLY LOGIC READY)
// =====================
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    // 🔥 IMPORTANT FIX:
    // creator is NOT added to members anymore
    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members: [],
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// ADD MEMBER (ADMIN ONLY)
// =====================
exports.addMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        message: "memberId required",
      });
    }

    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // 🔥 ONLY ADMIN (CREATOR)
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    const alreadyMember = project.members.some(
      (id) => id.toString() === memberId
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    project.members.push(memberId);
    await project.save();

    const updated = await Project.findById(project._id).populate(
      "members",
      "name email role"
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// REMOVE MEMBER
// =====================
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can remove members",
      });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== req.params.memberId
    );

    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// UPDATE PROJECT
// =====================
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can update project",
      });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// DELETE PROJECT
// =====================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can delete project",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};