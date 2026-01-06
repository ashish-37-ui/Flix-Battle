import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";
import "./Auth.css";


function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
  if (!username.trim()) return;

  const user = loginUser(username); // ✅ capture returned user
  setCurrentUser(user);             // ✅ now user is defined
  navigate("/");
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Login to vote, like opinions, and create battles.</p>

        <input
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={handleLogin} className="primary-btn">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
