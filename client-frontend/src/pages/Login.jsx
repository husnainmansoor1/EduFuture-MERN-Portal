import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";   
import "react-toastify/dist/ReactToastify.css"; 

// React Icons
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";

import "../styles/Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful", { autoClose: 2000 });

      setTimeout(() => {
        if (res.data.user.role === "teacher") {
          navigate("/dashboard/teacher");
        } else if (res.data.user.role === "student") {
          navigate("/dashboard/student");
        }
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg, { autoClose: 2000 });
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <div className="login-icon">
              <FaUnlockKeyhole size={35} />
            </div>
            <h2 className="login-title">Sign-In Your Account </h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon"><FaEnvelope /></div>
              <input
                type="email"
                name="email"
                className="login-input"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <div className="input-icon"><FaLock /></div>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn">Login</button>
            <div className="login-footer">
              Don’t have an account?{" "}
              <Link to="/register" className="signup-link">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
