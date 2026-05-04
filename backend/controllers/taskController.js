const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// =====================
// GET TASKS BY PROJECT
// =====================
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isCreator = project.createdBy.toString() === req.user.id;

    const isMember = project.members?.some(
      (id) => id.toString() === req.user.id
    );

    if (!isCreator && !isMember) {
      return res.status(403).json({
        message: "Not authorized to view tasks",
      });
    }

    const tasks = await Task.find({ projectId }).populate(
      "assignedTo",
      "name email role"
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// CREATE TASK (ADMIN ONLY)
// =====================
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      projectId,
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 ONLY ADMIN (CREATOR)
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can create tasks",
      });
    }

    // optional validation if assigning user
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo: assignedTo || null,
      projectId,
    });

    const populatedTask = await Task.findById(task._id).populate(
      "assignedTo",
      "name email role"
    );

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// UPDATE TASK
// =====================
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isCreator = project.createdBy.toString() === req.user.id;

    const isAssigned =
      task.assignedTo &&
      task.assignedTo.toString() === req.user.id;

    if (!isCreator && !isAssigned) {
      return res.status(403).json({
        message: "Not authorized to update this task",
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "name email role");

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// DELETE TASK
// =====================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can delete tasks",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// DASHBOARD STATS (FIXED)
// =====================
exports.getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id },
      ],
    });

    const projectIds = projects.map((p) => p._id);

    const totalTasks = await Task.countDocuments({
      projectId: { $in: projectIds },
    });

    const tasksByStatus = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const tasksPerUser = await Task.aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const overdueTasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" },
    });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        tasksByStatus,
        tasksPerUser,
        overdueTasksCount: overdueTasks.length,
        overdueTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};