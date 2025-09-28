import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React Icons
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md"; // 🎯 alternative
import { IoSchoolSharp } from "react-icons/io5"; // 🎓 alternative

import Navbar from "../components/Navbar";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);

      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);

      toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="register-page">
      {/* <Navbar /> */}
      <div className="register-wrapper">
        <div className="register-container">
          <div className="register-header">
            <div className="register-icon">
              <IoSchoolSharp size={40} />
            </div>
            <h2 className="register-title">Create Your Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <div className="input-icon"><FaUser /></div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon"><FaEnvelope /></div>
              <input
                type="email"
                name="email"
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
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon"><MdOutlineEmojiEvents /></div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Your Role
                </option>
                <option value="student">Student <FaUserGraduate /></option>
                <option value="teacher">Teacher <FaChalkboardTeacher /></option>
              </select>
            </div>

            <button type="submit" className="register-btn">
              <span>Create Account</span>
              <div className="btn-arrow">→</div>
            </button>

            <div className="register-footer">
              <p>Already have an account?</p>
              <Link to="/login" className="login-link">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
