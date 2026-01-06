import { Link } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth";

import "./Navbar.css";

function Navbar({ currentUser, setCurrentUser }) {
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    window.location.reload();
    setCurrentUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">FlixBattle</Link>
      </div>

      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/battle">Battle</Link>
        <Link to="/trends">Trends</Link>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <div className="user-menu">
            <span className="username">👤 {currentUser.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
