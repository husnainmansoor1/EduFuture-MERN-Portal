import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../styles/FrontPageNavbar.css";

export default function FrontPageNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="FrontPageNavbar">
      <div className="logo" onClick={() => navigate("/login")}>
        HM-Learning-Portal
      </div>
      <div className="nav-right">
        <FaSignInAlt className="login-icon" onClick={() => navigate("/login")} />
      </div>
    </nav>
  );
}
