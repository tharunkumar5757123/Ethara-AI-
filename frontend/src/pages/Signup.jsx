import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import "./Auth.css";

function Signup({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Member", // ✅ default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================
  // INPUT CHANGE
  // =====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, role } = formData;

    // VALIDATION
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.signup({
        name: name.trim(),
        email: email.trim(),
        password,
        role, // ✅ role support added
      });

      const { token, user } = response.data;

      // LOGIN USER
      onLogin(token, user);

      // REDIRECT
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>

        {/* ERROR */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          {/* ✅ ROLE SELECTION (IMPORTANT FOR ADMIN CONTROL) */}
          {/* <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div> */}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;