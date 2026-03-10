
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth";
import NotificationBell from "../components/NotificationBell";
import { useState, useRef, useEffect } from "react";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setOpenMenu(false);
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* LEFT - LOGO */}
      <div className="navbar-left" onClick={() => navigate("/")}>
        FlixBattle
      </div>

      {/* CENTER - NAV LINKS */}
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

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* Notifications */}
        {currentUser && <NotificationBell />}

        {/* Login button */}
        {!currentUser ? (
          <span
            className="nav-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        ) : (
          <div className="profile-wrapper" ref={menuRef}>

            {/* Profile trigger */}
            <div
              className="profile-trigger"
              onClick={() => setOpenMenu(!openMenu)}
            >
              👤 {currentUser.username} ▾
            </div>

            {/* Dropdown */}
            {openMenu && (
              <div className="profile-dropdown">

                <div
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                >
                  👤 Profile
                </div>

                <div
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

