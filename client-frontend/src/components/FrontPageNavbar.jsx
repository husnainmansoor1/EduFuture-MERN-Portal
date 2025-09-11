import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../styles/FrontPageNavbar.css";

export default function FrontPageNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="FrontPageNavbar">
      <div className="logo" onClick={() => navigate("/login")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="40"
          viewBox="0 0 250 70"
        >
          <path
            d="M35 5 L65 20 L65 50 L35 65 L5 50 L5 20 Z"
            fill="#f4f4f4"
            stroke="#0d1e37"
            strokeWidth="2"
          />
          <path d="M20 18 L35 12 L50 18 L35 24 Z" fill="black" />
          <line
            x1="35"
            y1="24"
            x2="35"
            y2="30"
            stroke="black"
            strokeWidth="2"
          />
          <text
            x="35"
            y="48"
            fontFamily="Manufacturing Consent, system-ui"
            fontSize="18"
            fontWeight="bold"
            fill="#2577c8"
            textAnchor="middle"
          >
            HM
          </text>
          <text
            x="80"
            y="47"
            fontFamily="Manufacturing Consent, system-ui"
            fontSize="40"
            fontWeight="700"
            fill="#2982da"
            stroke="#eaecee"
            title="HM Learning portal"
          >
            Learning
          </text>
          <title>HM Learning Portal</title>
        </svg>
      </div>
      <div className="nav-right">
        
        <FaSignInAlt
          className="login-icon"
          onClick={() => navigate("/login")}
        />
      </div>
    </nav>
  );
}
