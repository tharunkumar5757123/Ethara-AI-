import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI } from "../services/api";
import "./Projects.css";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [memberInputs, setMemberInputs] = useState({});

  // =====================
  // LOAD PROJECTS
  // =====================
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await projectAPI.getProjects();
      setProjects(res?.data?.data || []);

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // HANDLE INPUT
  // =====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // CREATE PROJECT
  // =====================
  const handleCreateProject = async (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    if (!title) {
      setError("Project title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await projectAPI.createProject({
        title,
        description: formData.description.trim(),
      });

      setFormData({ title: "", description: "" });
      setShowForm(false);

      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================
  // DELETE PROJECT
  // =====================
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await projectAPI.deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  // =====================
  // ADD MEMBER
  // =====================
  const setMemberInput = (projectId, updates) => {
    setMemberInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        ...updates,
      },
    }));
  };

  const handleSearchUsers = async (projectId, query) => {
    setMemberInput(projectId, {
      query,
      selectedUser: null,
      loading: true,
    });

    if (!query.trim()) {
      setMemberInput(projectId, {
        results: [],
        loading: false,
      });
      return;
    }

    if (query.trim().length < 2) {
      setMemberInput(projectId, {
        results: [],
        loading: false,
      });
      return;
    }

    try {
      const res = await projectAPI.searchUsers(query.trim());
      setMemberInput(projectId, {
        results: res?.data?.data || [],
        loading: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search users");
      setMemberInput(projectId, {
        results: [],
        loading: false,
      });
    }
  };

  const handleSelectUser = (projectId, user) => {
    setMemberInput(projectId, {
      query: `${user.name} (${user.email})`,
      selectedUser: user,
      results: [],
      loading: false,
    });
  };

  const handleAddMember = async (projectId) => {
    const selectedUser = memberInputs[projectId]?.selectedUser;
    if (!selectedUser?._id) {
      setError("Please select a member from the dropdown.");
      return;
    }

    try {
      await projectAPI.addMember(projectId, selectedUser._id);

      setMemberInputs((prev) => ({
        ...prev,
        [projectId]: {
          query: "",
          selectedUser: null,
          results: [],
          loading: false,
        },
      }));

      setError("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  // =====================
  // NAVIGATE
  // =====================
  const handleViewTasks = (id) => {
    navigate(`/projects/${id}/tasks`);
  };

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <div className="container">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="container">

      {/* HEADER */}
      <div className="projects-header">
        <h1>Projects</h1>

        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Cancel" : "+ New Project"}
        </button>
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* CREATE FORM */}
      {showForm && (
        <div className="card form-card">
          <form onSubmit={handleCreateProject}>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project title"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />

            <button className="btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      )}

      {/* PROJECT LIST */}
      <div className="projects-grid">

        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="project-card">

              <h3>{project.title}</h3>
              <p>{project.description || "No description"}</p>

              <div className="project-meta">
                <small>Members: {project.members?.length || 0}</small>
              </div>

              {/* ADD MEMBER */}
              <div className="add-member">
                <input
                  placeholder="Search users by name"
                  value={memberInputs[project._id]?.query || ""}
                  onChange={(e) =>
                    handleSearchUsers(project._id, e.target.value)
                  }
                />

                <button
                  className="btn-primary"
                  onClick={() => handleAddMember(project._id)}
                  type="button"
                >
                  Add
                </button>

                {memberInputs[project._id]?.loading && (
                  <div className="search-loading">Searching users...</div>
                )}

                {memberInputs[project._id]?.results?.length > 0 && (
                  <ul className="search-results">
                    {memberInputs[project._id].results.map((user) => (
                      <li
                        key={user._id}
                        onClick={() => handleSelectUser(project._id, user)}
                      >
                        <strong>{user.name}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ACTIONS */}
              <div className="project-actions">

                <button
                  className="btn-primary"
                  onClick={() => handleViewTasks(project._id)}
                >
                  Tasks
                </button>

                <button
                  className="btn-danger"
                  onClick={() => handleDeleteProject(project._id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Projects;