import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage (IMPORTANT for backend auth)
    localStorage.removeItem("token");

    // Safe callback
    if (onLogout) onLogout();

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          📊 Task Manager
        </Link>

        <ul className="nav-menu">

          <li className="nav-item">
            <Link to="/dashboard" className="nav-links">
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/projects" className="nav-links">
              Projects
            </Link>
          </li>

          <li className="nav-item">
            <span className="nav-user">
              {user?.name || "Guest"}
            </span>
          </li>

          <li className="nav-item">
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;