import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-logo">FlixBattle</div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/battle">Battle</Link>
        <Link to="/trends">Trends</Link>

        <span>Rankings</span>
        <span>Login</span>
      </div>
    </div>
  );
}



export default Navbar;
