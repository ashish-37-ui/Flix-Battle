
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth";
import NotificationBell from "../components/NotificationBell";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  return (
    <nav className="navbar">

      {/* LEFT — LOGO */}
      <div
        className="navbar-left logo"
        onClick={() => navigate("/")}
      >
        FlixBattle
      </div>

      {/* CENTER — NAV LINKS */}
      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/trends">Trends</Link>

        {currentUser && (
          <span
            className="create-link"
            onClick={() => navigate("/create")}
          >
            + Create
          </span>
        )}
      </div>

      {/* RIGHT — ACTIONS */}
      <div className="navbar-right">

        {currentUser && <NotificationBell />}

        {!currentUser ? (
          <span
            className="nav-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        ) : (
          <div className="profile-menu">

            <span
              className="profile-name"
              onClick={() => navigate("/profile")}
            >
              👤 {currentUser.username || "Profile"}
            </span>

            <span
              className="logout-link"
              onClick={() => {
                logoutUser();
                navigate("/");
              }}
            >
              Logout
            </span>

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

