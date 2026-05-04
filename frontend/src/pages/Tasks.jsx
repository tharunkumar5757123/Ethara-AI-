import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskAPI, projectAPI } from "../services/api";
import "./Tasks.css";

function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
  });

  // =====================
  // FETCH DATA
  // =====================
  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);

      const [projectRes, tasksRes] = await Promise.all([
        projectAPI.getProject(projectId),
        taskAPI.getTasksByProject(projectId),
      ]);

      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // INPUT HANDLER
  // =====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // CREATE TASK
  // =====================
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await taskAPI.createTask({
        ...formData,
        projectId,
      });

      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "To Do",
      });

      setShowForm(false);
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  // =====================
  // UPDATE STATUS
  // =====================
  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await taskAPI.updateTask(taskId, { status });
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  // =====================
  // DELETE TASK
  // =====================
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await taskAPI.deleteTask(taskId);
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <div className="container">
        <p>Loading tasks...</p>
      </div>
    );
  }

  // =====================
  // SAFE GROUPING
  // =====================
  const statuses = ["To Do", "In Progress", "Done"];

  const tasksByStatus = {
    "To Do": [],
    "In Progress": [],
    Done: [],
  };

  tasks.forEach((task) => {
    if (tasksByStatus[task.status]) {
      tasksByStatus[task.status].push(task);
    }
  });

  // =====================
  // FIXED ADMIN CHECK
  // =====================
  const isAdmin =
    project?.createdBy &&
    user?.id &&
    project.createdBy.toString() === user.id;

  return (
    <div className="container">

      {/* HEADER */}
      <div className="tasks-header">
        <div>
          <button className="btn-back" onClick={() => navigate("/projects")}>
            ← Back
          </button>

          <h1>{project?.title}</h1>
        </div>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "+ New Task"}
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* CREATE FORM */}
      {showForm && isAdmin && (
        <div className="card form-card">
          <h2>Create Task</h2>

          <form onSubmit={handleCreateTask}>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button className="btn-primary" type="submit">
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* KANBAN BOARD */}
      <div className="kanban-board">

        {statuses.map((status) => (
          <div key={status} className="kanban-column">

            <h3>{status}</h3>

            {tasksByStatus[status].map((task) => {

              const assignedUser =
                task.assignedTo?.name || "Unassigned";

              return (
                <div key={task._id} className="task-card">

                  <h4>{task.title}</h4>
                  <p>{task.description}</p>

                  <small>
                    Assigned: {assignedUser}
                  </small>

                  <div className="task-actions">

                    {/* STATUS CHANGE */}
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateTaskStatus(task._id, e.target.value)
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    {/* ADMIN DELETE ONLY */}
                    {isAdmin && (
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Tasks;