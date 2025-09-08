import React from "react";
import { useNavigate } from "react-router-dom";
import FrontPageNavbar from "../components/FrontPageNavbar";
import "../styles/FrontPage.css";

export default function FrontPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Class Management",
      desc: "Easily create and join classes.",
    },
    {
      title: "Content Sharing",
      desc: "Share announcements, PDFs, and videos.",
    },
    {
      title: "Role-based Access",
      desc: "Separate dashboards for teachers and students.",
    },
    {
      title: "User-friendly Interface",
      desc: "Clean design and simple navigation.",
    },
  ];

  return (
    <div className="front-page">
      <FrontPageNavbar />

      <section className="hero">
        <h1>Welcome to Our Educational Platform</h1>
        <p>
          This website is created for students and teachers to manage classes,
          share content, and collaborate efficiently.
        </p>
        <button onClick={() => navigate("/login")}>Login</button>
      </section>

      <section className="features">
        {features.map((feature, index) => (
          <div
            className="feature-card"
            key={index}
            onClick={() => navigate("/login")}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </section>

      <footer className="footer">© 2025 HM-Learning-Portal</footer>
    </div>
  );
}
