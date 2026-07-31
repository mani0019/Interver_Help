import React, { useState } from "react";
import axios from "axios";
import "../auth.route.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../pages/LoadingScreen";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { loading, handleLogin, getAndSetUser } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin(email, password);

    if (success) {
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back 👋</h1>

        <p>
          Login to continue your interview preparation journey.
        </p>

        <div className="google-login">
          <GoogleLogin
  onSuccess={(credentialResponse) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
        {
          token: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      )
      .then(async () => {
        await getAndSetUser();
        navigate("/home");
      })
      .catch((err) => {
        console.error("Google login failed:", err.response?.data || err.message);
      });
  }}
  onError={() => console.log("Login Failed")}
/>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn">
            Login
          </button>

        </form>

        <p className="bottom-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;