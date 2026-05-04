import React, { useState, useEffect } from "react";
import { taskAPI } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  // =====================
  // FETCH DASHBOARD DATA
  // =====================
  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await taskAPI.getDashboardStats();
      setStats(res?.data?.data || null);

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <div className="container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // =====================
  // ERROR
  // =====================
  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  // =====================
  // SAFE STATUS COUNT
  // =====================
  const statusCounts = {
    "To Do": 0,
    "In Progress": 0,
    Done: 0,
  };

  (stats?.tasksByStatus || []).forEach((item) => {
    statusCounts[item._id] = item.count;
  });

  return (
    <div className="container">

      <h1>Dashboard</h1>

      {/* ===================== STATS ===================== */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats?.totalTasks || 0}</p>
        </div>

        <div className="stat-card">
          <h3>To Do</h3>
          <p className="stat-number">{statusCounts["To Do"]}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{statusCounts["In Progress"]}</p>
        </div>

        <div className="stat-card">
          <h3>Done</h3>
          <p className="stat-number">{statusCounts["Done"]}</p>
        </div>

        <div className="stat-card danger">
          <h3>Overdue Tasks</h3>
          <p className="stat-number">
            {stats?.overdueTasksCount || 0}
          </p>
        </div>

      </div>

      {/* ===================== OVERDUE TASKS ===================== */}
      {(stats?.overdueTasks || []).length > 0 && (
        <div className="section">
          <h2>Overdue Tasks</h2>

          <div className="tasks-list">
            {stats.overdueTasks.map((task) => (
              <div key={task._id} className="task-item">

                <h4>{task.title}</h4>
                <p>{task.description || "No description"}</p>

                <small>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </small>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TASKS PER USER ===================== */}
      {(stats?.tasksPerUser || []).length > 0 && (
        <div className="section">
          <h2>Tasks Per User</h2>

          <div className="users-list">
            {stats.tasksPerUser.map((item, index) => (
              <div key={item._id || index} className="user-item">

                <h4>
                  {item.user?.name || "Unassigned"}
                </h4>

                <p>{item.count} tasks</p>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;