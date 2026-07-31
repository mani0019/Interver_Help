import React, { useState } from "react";
import "../auth.route.scss";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../pages/LoadingScreen";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleRegister(username, email, password);

    if (success) {
      navigate("/login");
    } else {
      alert("Registration failed.");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <p>
          Join Career Navigator and start preparing for your dream job.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Create Account
          </button>
        </form>

        <p className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;