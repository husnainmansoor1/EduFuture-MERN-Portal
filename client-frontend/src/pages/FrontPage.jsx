import React from "react";
import { useNavigate } from "react-router-dom";
import FrontPageNavbar from "../components/FrontPageNavbar";
import "../styles/FrontPage.css";

export default function FrontPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Class Management",
      desc: "Effortlessly create, organize, and manage your classes with intuitive tools designed for modern education.",
      icon: "👥"
    },
    {
      title: "Content Sharing",
      desc: "Share announcements, documents, videos, and resources seamlessly with your students and colleagues.",
      icon: "📚"
    },
    {
      title: "Role-based Access",
      desc: "Personalized dashboards and features tailored specifically for teachers and students.",
      icon: "🔐"
    },
    {
      title: "User-friendly Interface",
      desc: "Modern, intuitive design that makes learning and teaching an enjoyable experience.",
      icon: "✨"
    },
  ];

  return (
    <div className="front-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚀 Transform Your Learning Experience</span>
          </div>
          <h1>
            Welcome to Our
            <span className="gradient-text"> Educational Platform</span>
          </h1>
          <p>
            Empower educators and students with our comprehensive platform designed for
            seamless collaboration, content sharing, and classroom management in the digital age.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Get Started Today
              <span className="btn-arrow">→</span>
            </button>
            <button className="secondary-btn">
              Learn More
            </button>
          </div>
          {/* <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Teachers</span>
            </div>
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Schools</span>
            </div>
          </div> */}
        </div>
        <div className="hero-decoration">
          <div className="floating-card card-1">
            <div className="card-icon">📖</div>
            <div className="card-text">Interactive Learning</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🎯</div>
            <div className="card-text">Goal Tracking</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">💡</div>
            <div className="card-text">Smart Insights</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-header">
          <h2>Powerful Features for <span className="gradient-text">Modern Education</span></h2>
          <p>Discover the tools that make teaching and learning more effective and engaging</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
              onClick={() => navigate("/login")}
            >
              <div className="feature-icon">
                <span>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <div className="feature-arrow">
                <span>Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Classroom?</h2>
          <p>Join thousands of educators and students who are already experiencing the future of education</p>
          <button className="cta-btn" onClick={() => navigate("/login")}>
            Start Your Journey
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">EduPortal</span>
            </div>
            <p>Empowering education through technology</p>
          </div>
          <div className="footer-info">
            <p>&copy; 2025 HM-Learning-Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}